import React, {useEffect, useState} from "react";
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
import messageModalSlice, {MessageModalState} from "@/slices/message_modal_slice";
import RegisterRequest from "@/models/value_objects/contracts/requests/authentications/register_request";
import RegisterResponse from "@/models/value_objects/contracts/response/authentications/register_response";
import Image from "next/image";
import RoleService from "@/services/role_service";
import Role from "@/models/entities/role";

export default function Register() {

    const router = useRouter();

    const [roles, setRoles] = useState<Role[]>([]);

    const dispatch = useDispatch();

    useEffect(() => {
        const roleService: RoleService = new RoleService();
        roleService.readAll().then((result: AxiosResponse<Content<Role[]>>) => {
            const content = result.data;
            setRoles(content.data);
        })
    }, []);

    const registerSchema = Yup.object().shape({
        name: Yup.string().required("Required"),
        email: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string().required("Required"),
        confirmPassword: Yup.string()
            .required("Required")
            .oneOf([Yup.ref("password"), ""], "Passwords must match"),
        roleId: Yup.string().required("Required"),
    });

    const handleSubmit = (values: any, actions: any) => {
        const authenticationService = new AuthenticationService();
        const request: RegisterRequest = {
            name: values.name,
            email: values.email,
            password: values.password,
            roleId: values.roleId
        }
        authenticationService.register(request)
            .then((result: AxiosResponse<Content<RegisterResponse>>) => {
                const content = result.data;

                if (!content.data) {
                    const messageModalState: MessageModalState = {
                        title: "Status",
                        content: content.message,
                        isShow: true
                    }
                    dispatch(messageModalSlice.actions.configure(messageModalState))
                } else {
                    dispatch(authenticationSlice.actions.register(content.data.entity));
                    const messageModalState: MessageModalState = {
                        title: "Status",
                        content: content.message,
                        isShow: true
                    }
                    dispatch(messageModalSlice.actions.configure(messageModalState))
                }
            })
            .catch((error) => {
                console.log(error)
                const messageModalState: MessageModalState = {
                    title: "Status",
                    content: error.message,
                    isShow: true
                }
                dispatch(messageModalSlice.actions.configure(messageModalState))
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
                </div>
                <div className="form">
                    <Formik
                        validationSchema={registerSchema}
                        initialValues={{
                            name: "",
                            email: "",
                            password: "",
                            confirmPassword: "",
                            roleId: ""
                        }}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {(props) => (
                            <Form>
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
                                    <Field
                                        type="password" name="password" className="form-control"/>
                                    <ErrorMessage name="password" component="div" className="text-danger"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label htmlFor="confirmPassword">Confirm password</label>
                                    <Field type="password" name="confirmPassword" className="form-control"/>
                                    <ErrorMessage name="confirmPassword" component="div" className="text-danger"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label htmlFor="roleId">Role</label>
                                    <Field as="select" name="roleId" className="form-control">
                                        {
                                            roles.map((role: Role, index) => {
                                                return (
                                                    <option key={index} value={role.id}>{role.name}</option>
                                                )
                                            })
                                        }
                                    </Field>
                                    <ErrorMessage name="roleId" component="div" className="text-danger"/>
                                </fieldset>
                                <button type="submit" className="btn btn-primary">
                                    Register
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="suggest-login">
                    <div className="text">
                        Already have an account? Login at <a href="/authentications/login">here</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
