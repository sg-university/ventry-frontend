import React, {useEffect} from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import LogoImage from "@/assets/images/auth_logo.svg";
import SplashImage from "@/assets/images/auth_register.svg";
import "@/styles/pages/authentications/login.scss";
import MessageModal from "@/components/message_modal";
import Image from "next/image";
import AuthenticationService from "@/services/authentication_service";
import LoginRequest from "@/models/value_objects/contracts/requests/authentications/login_request";
import {AxiosResponse} from "axios";
import LoginResponse from "@/models/value_objects/contracts/response/authentications/login_response";
import Content from "@/models/value_objects/contracts/content";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import pageSlice, {PageState} from "@/slices/page_slice";
import authenticationSlice from "@/slices/authentication_slice";
import messageModalSlice, {MessageModalState} from "@/slices/message_modal_slice";
import Link from "next/link";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

export default function Login() {
    const router = useRouter();
    const dispatch = useDispatch();
    const pageState: PageState = useSelector((state: any) => state.page);
    
    const handleSubmit = (values: any, actions: any) => {
        const authenticationService = new AuthenticationService();
        const request: LoginRequest = {
            email: values.email,
            password: values.password
        }
        authenticationService.login(request)
            .then((result: AxiosResponse<Content<LoginResponse>>) => {
                const content = result.data;

                if (!content.data) {
                    dispatch(messageModalSlice.actions.configure({
                        title: "Status",
                        type: "failed",
                        content: content.message,
                        isShow: true
                    }))
                } else {
                    router.push(`/managements/items`)
                    dispatch(authenticationSlice.actions.login(content.data.entity));
                    dispatch(pageSlice.actions.configureAccountManagement({
                      ...pageState.accountManagement,
                      account: content.data,
                  }))
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

    useEffect(() => {
        router.prefetch('/managements/items')
    }, [router])

    return (
        <div className="page login-auth">
            <div className="left-section">
                <div className="logo">
                    <Image src={LogoImage} alt="ventry-logo"/>
                </div>
                <div className="splash">
                    <Image src={SplashImage} alt="ventry-logo"/>
                </div>
                <div className="description">
                    <div className="text">Sign-in your account now!</div>
                </div>
            </div>
            <MessageModal/>
            <div className="right-section">
                <div className="title">
                    <h1>Sign-in</h1>
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
                                    <label htmlFor="email">Email</label>
                                    <Field type="email" name="email" className="form-control"/>
                                    <ErrorMessage name="email" component="div" className="text-danger"/>
                                </fieldset>
                                <fieldset className="form-group pb-2">
                                    <label htmlFor="password">Password</label>
                                    <Field type="password" name="password" className="form-control"/>
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
                        Didn&apos;t have an account? Register at{" "}
                        <Link href="/authentications/register">here</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
