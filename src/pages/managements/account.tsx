import React, {useEffect} from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";

import AccountImage from "@/assets/images/profile-account.svg";
import MessageModal from "@/components/message_modal";
import Image from "next/image";
import pageSlice, {PageState} from "@/slices/page_slice";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import PatchOneByIdRequest
    from "@/models/value_objects/contracts/requests/managements/accounts/patch_one_by_id_request";
import {AxiosResponse} from "axios";
import Content from "@/models/value_objects/contracts/content";
import messageModalSlice from "@/slices/message_modal_slice";
import authenticationSlice, {AuthenticationState} from "@/slices/authentication_slice";
import AccountService from "@/services/account_service";
import Account from "@/models/entities/account";
import Authenticated from "@/layouts/authenticated";
import "@/styles/pages/managements/account.scss"
import RoleService from "@/services/role_service";
import Role from "@/models/entities/role";


const updateSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    role: Yup.string().required("Required"),
    password: Yup.string().required("Required"),
    confirmPassword: Yup.string()
        .required("Required")
        .oneOf([Yup.ref("password"), ""], "Passwords must match"),
});

export default function Accounts() {
    const accountService = new AccountService()
    const roleService = new RoleService()
    const pageState: PageState = useSelector((state: any) => state.page);
    const authenticationState: AuthenticationState = useSelector((state: any) => state.authentication);
    const {currentAccount} = authenticationState;
    const {currentRole, roles} = pageState.accountManagement;
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        fetchCurrentRoleAndRoles()
    }, [])

    const fetchCurrentRoleAndRoles = () => {
        roleService.readAll().then((response) => {
            const content: Content<Role[]> = response.data;
            dispatch(pageSlice.actions.configureAccountManagement({
                ...pageState.accountManagement,
                roles: content.data,
                currentRole: content.data.find((role) => role.id === currentAccount?.roleId)
            }))
        }).catch((error) => {
            console.log(error);
        })
    }

    const handleAccountSubmit = (values: any, actions: any) => {
        const accountService = new AccountService()
        const request: PatchOneByIdRequest = {
            id: currentAccount?.id,
            body: {
                roleId: currentAccount?.roleId,
                locationId: currentAccount?.locationId,
                name: values.name,
                email: values.email,
                password: values.password
            }
        }
        accountService
            .patchOneById(request)
            .then((result: AxiosResponse<Content<Account>>) => {
                const content = result.data;
                dispatch(pageSlice.actions.configureAccountManagement({
                    ...pageState.accountManagement,
                    currentAccount: content.data
                }))
                dispatch(authenticationSlice.actions.update({
                  currentAccount: content.data
              }))
                dispatch(messageModalSlice.actions.configure({
                    type: "succeed",
                    content: "Update Account succeed.",
                    isShow: true
                }))
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

    const handleLogout = () => {
        router.push('/')
        dispatch(authenticationSlice.actions.logout())
    }

    return (
        <Authenticated>
            <div className="page account-profile">
                <MessageModal/>
                <div className="header">
                    <div className="left-section">
                        <div className="title">
                            <h1>Account Profile</h1>
                        </div>
                        <div className="description">
                            <div className="text">
                                You can manage your account in here (view and update account).
                            </div>
                        </div>
                    </div>
                    <div className="right-section">
                        <div className="control d-none">
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => handleLogout()}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
                <div className="body">
                    <div className="image">
                        <Image
                            src={AccountImage}
                            alt="account"
                        />
                    </div>
                    <div className="form">
                        <Formik
                            validationSchema={updateSchema}
                            initialValues={{
                                name: currentAccount?.name,
                                email: currentAccount?.email,
                                role: currentRole?.id,
                                password: currentAccount?.password,
                                confirmPassword: ""
                            }}
                            onSubmit={handleAccountSubmit}
                            enableReinitialize
                        >
                            {(props) => (
                                <Form>
                                    <fieldset className="form-group">
                                        <label htmlFor="name">Name</label>
                                        <Field type="text" name="name" className="form-control mt-1"/>
                                        <ErrorMessage name="name" component="div" className="text-danger"/>
                                    </fieldset>
                                    <fieldset className="form-group pt-2">
                                        <label htmlFor="email">Email</label>
                                        <Field type="email" name="email" className="form-control mt-1"/>
                                        <ErrorMessage
                                            name="email"
                                            component="div"
                                            className="text-danger"
                                        />
                                    </fieldset>
                                    <fieldset className="form-group pt-2">
                                        <label htmlFor="role">Role</label>
                                        <Field as="select" name="role" className="form-control mt-1" disabled>
                                            {roles?.map((role: Role) => (
                                                <option key={role.id} value={role.id}>
                                                    {role.name}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="role" component="div" className="text-danger"/>
                                    </fieldset>
                                    <fieldset className="form-group pt-2">
                                        <label htmlFor="password">Password</label>
                                        <Field type="password" name="password" className="form-control mt-1"/>
                                        <ErrorMessage name="password" component="div" className="text-danger"/>
                                    </fieldset>
                                    <fieldset className="form-group pt-2">
                                        <label htmlFor="confirmPassword">Confirm password</label>
                                        <Field type="password" name="confirmPassword" className="form-control mt-1"/>
                                        <ErrorMessage name="confirmPassword" component="div" className="text-danger"/>
                                    </fieldset>
                                    <button type="submit" className="btn btn-primary pt-2">
                                        Update
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>

                    <div className="control">
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => handleLogout()}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
