import React from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import LogoImage from "@/assets/images/auth_logo.svg";
import SplashImage from "@/assets/images/auth_register.svg";
import "@/styles/pages/authentications/login.scss";
import MessageModal from "@/components/message_modal";
import Image from "next/image";
import AuthenticationService from "@/services/authentication_service";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {PageState} from "@/slices/page_slice";
import authenticationSlice from "@/slices/authentication_slice";
import messageModalSlice from "@/slices/message_modal_slice";
import Link from "next/link";
import RoleService from "@/services/role_service";

const loginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
});

export default function Login() {
    const router = useRouter();
    const dispatch = useDispatch();
    const pageState: PageState = useSelector((state: any) => state.page);


    const authenticationService = new AuthenticationService();
    const roleService = new RoleService();

    const handleSubmit = (values: any, actions: any) => {

        Promise.all([
            authenticationService.login({
                email: values.email,
                password: values.password
            }),
            roleService.readAll()
        ])
            .then((response) => {
                const authenticationContent = response[0].data;
                const roleContent = response[1].data;

                if (!authenticationContent.data) {
                    dispatch(messageModalSlice.actions.configure({
                        type: "failed",
                        content: authenticationContent.message,
                        isShow: true
                    }))
                } else {
                    const currentRole = roleContent.data.find((role) => role.id === authenticationContent.data.entity.roleId);

                    dispatch(authenticationSlice.actions.login({
                        currentAccount: authenticationContent.data.entity,
                        currentRole: currentRole,
                    }));

                    if (currentRole.name === "admin") {
                        router.push(`/managements/items`)
                    } else if (currentRole.name === "cashier") {
                        router.push(`/managements/pos`)
                    } else {
                        dispatch(messageModalSlice.actions.configure({
                            type: "failed",
                            content: "Your account role name is not recognized.",
                            isShow: true
                        }))
                    }
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
        <div className="page login-auth">
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
                    <div className="text">Login your account now!</div>
                </div>
            </div>
            <MessageModal/>
            <div className="right-section">
                <div className="title">
                    <h1>Login</h1>
                </div>
                <div className="form">
                    <Formik
                        validationSchema={loginSchema}
                        initialValues={{
                            email: "",
                            password: "",
                        }}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {(props) => (
                            <Form>
                                <fieldset className="form-group pb-2">
                                    <label htmlFor="email">Email<label htmlFor="code" className="text-danger">*</label></label>
                                    <Field type="email" name="email" className="form-control mt-2" placeholder="Email"/>
                                    <ErrorMessage name="email" component="div" className="text-danger"/>
                                </fieldset>
                                <fieldset className="form-group pb-2">
                                    <label htmlFor="password">Password<label htmlFor="code" className="text-danger">*</label></label>
                                    <Field type="password" name="password" className="form-control mt-2" placeholder="Passowrd must have at least 6 characters"/>
                                    <ErrorMessage name="password" component="div" className="text-danger"/>
                                </fieldset>
                                <button type="submit" className="btn btn-primary">
                                    Login
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="suggest-login">
                    <div className="text">
                        Didn&apos;t have an account? Register at <Link href="/authentications/register">here</Link>.
                    </div>
                </div>
            </div>
        </div>
    );
}
