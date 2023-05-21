import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import LogoImage from "@/assets/images/auth_logo.svg";
import SplashImage from "@/assets/images/auth_register.svg";
import "@/styles/pages/authentications/register.scss";
import MessageModal from "@/components/message_modal";
import AuthenticationService from "@/services/authentication_service";
import {AxiosResponse} from "axios";
import Content from "@/models/value_objects/contracts/content";
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";
import authenticationSlice from "@/slices/authentication_slice";
import messageModalSlice from "@/slices/message_modal_slice";
import RegisterRequest from "@/models/value_objects/contracts/requests/authentications/register_request";
import RegisterResponse from "@/models/value_objects/contracts/response/authentications/register_response";
import Image from "next/image";
import Role from "@/models/entities/role";
import Link from "next/link";
import {useState} from "react";

export default function Register() {

    const router = useRouter();

    const [roles, setRoles] = useState<Role[]>([]);

    const dispatch = useDispatch();

    const [accountData, setAccountData] = useState({});

    const [isFirstPage, setFirstPage] = useState(true);

    // useEffect(() => {
    //     const roleService: RoleService = new RoleService();
    //     roleService.readAll().then((result: AxiosResponse<Content<Role[]>>) => {
    //         const content = result.data;
    //         setRoles(content.data);
    //     })
    // }, []);

    const registerSchemaAccount = Yup.object().shape({
        name: Yup.string().required("Required"),
        email: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string().required("Required"),
        confirmPassword: Yup.string()
            .required("Required")
            .oneOf([Yup.ref("password"), ""], "Passwords must match"),
        // roleId: Yup.string().required("Required"),
    });

    const registerSchemaCompany = Yup.object().shape({
        companyName: Yup.string().required("Required"),
        companyDescription: Yup.string().required("Required"),
        companyAddress: Yup.string().required("Required"),
    });

    const handleSubmitAccount = (values: any, actions: any) => {
        const request: RegisterRequest = {
            name: values.name,
            email: values.email,
            password: values.password
            // roleId: values.roleId
        }
        setAccountData(request);
        setFirstPage(!isFirstPage);
    }

    const handleSubmitCompany = (values: any, actions: any) => {
        const authenticationService = new AuthenticationService();
        const request: RegisterRequest = {//ganti jadi company
            name: values.name,
            email: values.email,
            password: values.password
            // roleId: values.roleId
        }
        authenticationService.register(request)
            .then((result: AxiosResponse<Content<RegisterResponse>>) => {
                const content = result.data;

                if (!content.data) {
                    dispatch(messageModalSlice.actions.configure({
                        title: "Status",
                        type: "failed",
                        content: content.message,
                        isShow: true
                    }))
                } else {
                    dispatch(authenticationSlice.actions.register(content.data.entity));
                    dispatch(messageModalSlice.actions.configure({
                        title: "Status",
                        type: "succeed",
                        content: "Register Succeed",
                        isShow: true
                    }))
                    router.push('/authentications/login')
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


    return (
        <div className="page register-auth">
            <div className="left-section">
                <div className="logo">
                    <Image src={LogoImage} alt="ventry-logo"/>
                </div>
                <div className="splash">
                    <Image src={SplashImage} alt="ventry-logo"/>
                </div>
                <div className="description">
                    <div className="text">Sign-up your account now!</div>
                </div>
            </div>
            <MessageModal/>
            <div className="right-section">
                <div className="title">
                    <h1>Sign-up</h1>
                    <h6>{isFirstPage ? 'Account Information' : 'Company Information'}</h6>
                </div>
                <div className="form" style={{display: isFirstPage ? 'block' : 'none'}}>
                    <Formik
                        validationSchema={registerSchemaAccount}
                        initialValues={{
                            name: "",
                            email: "",
                            password: "",
                            confirmPassword: ""
                            // roleId: ""
                        }}
                        onSubmit={handleSubmitAccount}
                        enableReinitialize
                    >
                        {(props) => (
                            <Form>
                                <div className="firstPageForm">
                                    <fieldset className="form-group">
                                        <label htmlFor="name">Name</label>
                                        <Field type="text" name="name" className="form-control"/>
                                        <ErrorMessage name="name" component="div" className="text-danger"/>
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <Field type="email" name="email" className="form-control"/>
                                        <ErrorMessage name="email" component="div" className="text-danger"/>
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <label htmlFor="password">Password</label>
                                        <Field type="password" name="password" className="form-control"/>
                                        <ErrorMessage name="password" component="div" className="text-danger"/>
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <label htmlFor="confirmPassword">Confirm password</label>
                                        <Field type="password" name="confirmPassword" className="form-control"/>
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


                <div className="formCompany" style={{display: isFirstPage ? 'none' : 'block'}}>
                    <Formik
                        validationSchema={registerSchemaCompany}
                        initialValues={{
                            companyName: "",
                            companyDescription: "",
                            companyAddress: ""
                        }}
                        onSubmit={handleSubmitCompany}
                        enableReinitialize
                    >
                        {(props) => (
                            <Form>
                                <fieldset className="form-group">
                                    <label htmlFor="companyName">Company Name</label>
                                    <Field type="text" name="companyName" className="form-control"/>
                                    <ErrorMessage name="companyName" component="div" className="text-danger"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label htmlFor="companyDescription">Company Description</label>
                                    <Field type="text" name="companyDescription" className="form-control"
                                           component="textarea" rows="4"/>
                                    <ErrorMessage name="companyDescription" component="div" className="text-danger"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label htmlFor="companyAddress">Company Address</label>
                                    <Field type="text" name="companyAddress" className="form-control"
                                           component="textarea" rows="4"/>
                                    <ErrorMessage name="companyAddress" component="div" className="text-danger"/>
                                </fieldset>
                                <div className="secondPageButtons">
                                    <button onClick={() => setFirstPage(!isFirstPage)} type="button"
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
                        Already have an account? Login at <Link href="/authentications/login">here</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
