import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import LogoImage from "@/assets/images/auth_logo.svg";
import SplashImage from "@/assets/images/auth_register.svg";
import "@/styles/pages/authentications/register.scss";
import MessageModal from "@/components/message_modal";
import AuthenticationService from "@/services/authentication_service";
import {AxiosResponse} from "axios";
import Content from "@/models/value_objects/contracts/content";
import {useDispatch} from "react-redux";
import {useRouter} from "next/router";
import messageModalSlice from "@/slices/message_modal_slice";
import RegisterResponse from "@/models/value_objects/contracts/response/authentications/register_response";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import AccountRegisterRequest from "@/models/value_objects/contracts/requests/authentications/account_register_request";
import CompanyRegisterRequest from "@/models/value_objects/contracts/requests/authentications/company_register_request";
import LocationRegisterRequest
    from "@/models/value_objects/contracts/requests/authentications/location_register_request";

const registerSchemaAccount = Yup.object().shape({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required").min(6),
    confirmPassword: Yup.string()
        .required("Required")
        .oneOf([Yup.ref("password"), ""], "Passwords must match")
});

const registerSchemaCompany = Yup.object().shape({
    name: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
});

const registerSchemaLocation = Yup.object().shape({
    name: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
});

export default function Register() {
    const authenticationService = new AuthenticationService();
    const router = useRouter();

    const dispatch = useDispatch();

    const [page, setPage] = useState<number>(1);
    const [title, setTitle] = useState<string>('Account Information');

    const [accountRequest, setAccountRequest] = useState<AccountRegisterRequest>();
    const [companyRequest, setCompanyRequest] = useState<CompanyRegisterRequest>();
    const [locationRequest, setLocationRequest] = useState<LocationRegisterRequest>();

    const handleSubmitAccount = (values: any, actions: any) => {
        setAccountRequest({
            name: values.name,
            email: values.email,
            password: values.password
        });
        setTitle('Company Information');
        setPage(2);
    }

    const handleSubmitCompany = (values: any, actions: any) => {
        setCompanyRequest({
            name: values.name,
            description: values.description,
            address: values.address
        });
        setTitle('Location Information');
        setPage(3);
    }

    const handleSubmitLocation = async (values: any, actions: any) => {
        const locationRequest: LocationRegisterRequest = {
            name: values.name,
            description: values.description,
            address: values.address
        }

        setLocationRequest(locationRequest)

        authenticationService.register({
            account: accountRequest,
            company: companyRequest,
            location: locationRequest
        })
            .then((result: AxiosResponse<Content<RegisterResponse>>) => {
                const content = result.data;
                if (!content.data) {
                    dispatch(messageModalSlice.actions.configure({
                        type: "failed",
                        content: content.message,
                        isShow: true
                    }))
                } else {
                    dispatch(messageModalSlice.actions.configure({
                        type: "succeed",
                        content: "Register succeed.",
                        isShow: true
                    }))
                    router.push(`/authentications/login`)
                }
            })
            .catch((error) => {
                console.log(error)
                dispatch(messageModalSlice.actions.configure({
                    type: "failed",
                    content: error.message,
                    isShow: true
                }))
            })
            .finally(() => {
                actions.setSubmitting(false);
            });
    }

    const handleClickPreviousFromCompany = () => {
        setTitle('Account Information');
        setPage(1);
    }

    const handleClickPreviousFromLocation = () => {
        setPage(2);
        setTitle('Company Information');
    }

    return (
        <div className="page register-auth">
            <div className="left-section">
                <div className="logo">
                    <Link href="/" className="text-decoration-none" style={{color: "inherit"}}>
                        <Image src={LogoImage} alt="ventry-logo"/>
                    </Link>
                </div>
                <div className="splash">
                    <Image src={SplashImage} alt="ventry-logo"/>
                </div>
                <div className="description">
                    <div className="text">Register your account now!</div>
                </div>
            </div>
            <MessageModal/>
            <div className="right-section">
                <div className="title mb-3">
                    <h1>Register</h1>
                    <h6>{title}</h6>
                </div>
                <div className="form" style={{display: page == 1 ? 'block' : 'none'}}>
                    <Formik
                        validationSchema={registerSchemaAccount}
                        initialValues={{
                            name: "",
                            email: "",
                            password: "",
                            confirmPassword: ""
                        }}
                        onSubmit={handleSubmitAccount}
                        enableReinitialize
                    >
                        {(props) => (
                            <Form>
                                <div className="firstPageForm">
                                    <fieldset className="form-group">
                                        <label htmlFor="name">Name<label htmlFor="code" className="text-danger">*</label></label>
                                        <Field type="text" name="name" className="form-control mt-2" placeholder="Enter your name here"/>
                                        <ErrorMessage name="name" component="div" className="text-danger"/>
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <label htmlFor="email">Email<label htmlFor="code" className="text-danger">*</label></label>
                                        <Field type="email" name="email" className="form-control mt-2" placeholder="Enter your email here"/>
                                        <ErrorMessage name="email" component="div" className="text-danger"/>
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <label htmlFor="password">Password<label htmlFor="code" className="text-danger">*</label></label>
                                        <Field type="password" name="password" className="form-control mt-2" placeholder="Passowrd must have at least 6 characters"/>
                                        <ErrorMessage name="password" component="div" className="text-danger"/>
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <label htmlFor="confirmPassword">Confirm password<label htmlFor="code" className="text-danger">*</label></label>
                                        <Field type="password" name="confirmPassword" className="form-control mt-2" placeholder="Confirm password must match with password"/>
                                        <ErrorMessage name="confirmPassword" component="div" className="text-danger"/>
                                    </fieldset>

                                    <button type="submit" className="btn btn-primary">
                                        Next
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>


                <div className="form" style={{display: page == 2 ? 'block' : 'none'}}>
                    <Formik
                        validationSchema={registerSchemaCompany}
                        initialValues={{
                            name: "",
                            description: "",
                            address: ""
                        }}
                        onSubmit={handleSubmitCompany}
                        enableReinitialize
                    >
                        {(props) => (
                            <Form>
                                <fieldset className="form-group">
                                    <label htmlFor="name">Company Name</label>
                                    <Field type="text" name="name" className="form-control mt-2"/>
                                    <ErrorMessage name="name" component="div" className="text-danger"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label htmlFor="description">Company Description</label>
                                    <Field type="text" name="description" className="form-control mt-2"
                                           component="textarea" rows="4"/>
                                    <ErrorMessage name="description" component="div" className="text-danger"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label htmlFor="address">Company Address</label>
                                    <Field type="text" name="address" className="form-control mt-2"
                                           component="textarea" rows="4"/>
                                    <ErrorMessage name="address" component="div" className="text-danger"/>
                                </fieldset>
                                <div className="secondPageButtons">
                                    <button onClick={() => handleClickPreviousFromCompany()} type="button"
                                            className="btn btn-primary">Previous
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Next
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>

                <div className="form" style={{display: page == 3 ? 'block' : 'none'}}>
                    <Formik
                        validationSchema={registerSchemaLocation}
                        initialValues={{
                            name: "",
                            description: "",
                            address: ""
                        }}
                        onSubmit={handleSubmitLocation}
                        enableReinitialize
                    >
                        {(props) => (
                            <Form>
                                <fieldset className="form-group">
                                    <label htmlFor="name">Location Name</label>
                                    <Field type="text" name="name" className="form-control mt-2"/>
                                    <ErrorMessage name="name" component="div" className="text-danger"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label htmlFor="description">Location Description</label>
                                    <Field type="text" name="description" className="form-control mt-2"
                                           component="textarea" rows="4"/>
                                    <ErrorMessage name="description" component="div" className="text-danger"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label htmlFor="address">Location Address</label>
                                    <Field type="text" name="address" className="form-control mt-2"
                                           component="textarea" rows="4"/>
                                    <ErrorMessage name="address" component="div" className="text-danger"/>
                                </fieldset>
                                <div className="secondPageButtons">
                                    <button onClick={() => handleClickPreviousFromLocation()} type="button"
                                            className="btn btn-primary">Previous
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Register
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>

                <div className="suggest-login">
                    <div className="text">
                        Already have an account? Login at <Link href="/authentications/login">here</Link>.
                    </div>
                </div>
            </div>
        </div>
    );
}
