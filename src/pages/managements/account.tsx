import React, { useEffect, useState } from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";

import AccountImage from "@/assets/images/profile-account.svg";
import MessageModal from "@/components/message_modal";
import Image from "next/image";
import pageSlice, {PageState} from "@/slices/page_slice";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import PatchOneByIdRequest from "@/models/value_objects/contracts/requests/managements/accounts/patch_one_by_id_request";
import ReadOneByIdRequest from "@/models/value_objects/contracts/requests/managements/roles/read_one_by_id_request";
import {AxiosResponse} from "axios";
import Content from "@/models/value_objects/contracts/content";
import messageModalSlice, {MessageModalState} from "@/slices/message_modal_slice";
import authenticationSlice, {AuthenticationState} from "@/slices/authentication_slice";
import AccountService from "@/services/account_service";
import Account from "@/models/entities/account";
import Authenticated from "@/layouts/authenticated";
import "@/styles/pages/managements/account.scss"
import RoleService from "@/services/role_service";
import Role from "@/models/entities/role";
import message_modal_slice from "@/slices/message_modal_slice";


export default function Login() {
    const pageState: PageState = useSelector((state: any) => state.page);
    const { account } = pageState.accountManagement
    const [role, setRole] = useState("")
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
      const roleService = new RoleService()
      const request: ReadOneByIdRequest = {
        id: account.roleId
      }
      roleService
        .readOneById(request)
        .then((result: AxiosResponse<Content<Role>>) => {
            const content = result.data;
            setRole(content.data.name)
        })
        .catch((error) => {
            console.log(error)
            const messageModalState: MessageModalState = {
                title: "Status",
                type: "failed",
                content: error.message,
                isShow: true
            }
            dispatch(messageModalSlice.actions.configure(messageModalState))
        });
    }, [])

    const updateSchema = Yup.object().shape({
      name: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      role: Yup.string().required("Required"),
      password: Yup.string().required("Required"),
      confirmPassword: Yup.string()
        .required("Required")
        .oneOf([Yup.ref("password"), ""], "Passwords must match"),
    });
    
    const handleAccountSubmit = (values: any, actions: any) => {
      const accountService = new AccountService()
      const request: PatchOneByIdRequest = {
        id: account.id,
        body: {
          roleId: account.roleId,
          locationId: account.locationId,
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
              account: content.data
          }))
          const messageModalState: MessageModalState = {
            title: "Status",
            type: "success",
            content: "Update Account Success",
            isShow: true
          }
          dispatch(message_modal_slice.actions.configure(messageModalState))
        })
        .catch((error) => {
            console.log(error)
            const messageModalState: MessageModalState = {
                title: "Status",
                type: "failed",
                content: error.message,
                isShow: true
            }
            dispatch(messageModalSlice.actions.configure(messageModalState))
        })
        .finally(() => {
          actions.setSubmitting(false);
        });

    }

    const handleLogout = () => {
      router.push('/')
      dispatch(pageSlice.actions.configureAccountManagement({
          ...pageState.accountManagement,
          account: null
      }))
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
                onClick={() => this.handleLogout()}
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
              onError={(e) => {
                e.target.src = AccountImage;
              }}
              alt="account"
            />
          </div>
          <div className="form">
            <Formik
              validationSchema={updateSchema}
              initialValues={{
                name: account?.name || "",
                email: account?.email || "",
                role: role || "",
                password: account?.password || "",
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
                    <Field type="email" name="email" className="form-control mt-1" />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger"
                    />
                  </fieldset>
                  <fieldset className="form-group pt-2">
                      <label htmlFor="role">Role</label>
                      <Field type="text" name="role" className="form-control mt-1" disabled/>
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
                    Update Account
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
