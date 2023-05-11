import React, {useEffect} from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Modal} from "react-bootstrap";
import * as Yup from "yup";

import {useDispatch, useSelector} from "react-redux";
import "@/styles/components/managements/companies/account_update_modal.scss"
import pageSlice, {PageState} from "@/slices/page_slice";
import AccountService from "@/services/account_service";
import Content from "@/models/value_objects/contracts/content";
import Account from "@/models/entities/account";
import messageModalSlice from "@/slices/message_modal_slice";
import RoleService from "@/services/role_service";
import LocationService from "@/services/location_service";
import Role from "@/models/entities/role";

const updateSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    roleId: Yup.string().required("Required"),
    locationId: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
    confirmPassword: Yup.string()
        .required("Required")
        .oneOf([Yup.ref("password"), ""], "Passwords must match"),
});

export default function AccountUpdateModalComponent() {
    const accountService: AccountService = new AccountService();
    const roleService: RoleService = new RoleService();
    const locationService: LocationService = new LocationService();
    const pageState: PageState = useSelector((state: any) => state.page);
    const {
        accounts,
        roles,
        locations,
        isShowModal,
        currentAccount,
    } = pageState.companyAccountManagement;
    const dispatch = useDispatch();

    useEffect(() => {
        fetchRolesAndLocations();
    }, [])

    const fetchRolesAndLocations = () => {
        Promise.all([
            roleService.readAll(),
            locationService.readAll()
        ]).then((responses) => {
            const roles: Content<Role[]> = responses[0].data;
            const locations: Content<Location[]> = responses[1].data;
            dispatch(pageSlice.actions.configureCompanyAccountManagement({
                    ...pageState.companyAccountManagement,
                    roles: roles.data,
                    locations: locations.data
                })
            )
        }).catch((error) => {
            console.log(error)
        })
    }

    const handleShowModal = () => {
        dispatch(pageSlice.actions.configureCompanyAccountManagement({
                ...pageState.companyAccountManagement,
                isShowModal: !pageState.companyAccountManagement.isShowModal,
            })
        )
    };

    const handleUpdateSubmit = (value: any) => {
        accountService.patchOneById({
            id: currentAccount?.id,
            body: {
                name: value.name,
                email: value.email,
                password: value.password,
                roleId: value.roleId,
                locationId: value.locationId,
            }
        }).then((response) => {
            const content: Content<Account> = response.data;
            const messageModalState = {
                title: "Status",
                content: content.message,
                isShow: true
            }
            dispatch(messageModalSlice.actions.configure(messageModalState))
            dispatch(pageSlice.actions.configureCompanyAccountManagement({
                    ...pageState.companyAccountManagement,
                    currentAccount: content.data,
                    accounts: accounts?.map((account) => {
                        if (account.id === content.data.id) {
                            return content.data
                        }
                        return account
                    })
                })
            )
        }).catch((error) => {
            const messageModalState = {
                title: "Status",
                content: error.response.data.message,
                isShow: true
            }
            dispatch(messageModalSlice.actions.configure(messageModalState))
        })
    }


    return (
        <Modal
            show={isShowModal}
            onHide={handleShowModal}
            centered
            className="component account-update-modal"
        >
            <Modal.Header closeButton className="header">
                <Modal.Title>Account Update</Modal.Title>
            </Modal.Header>

            <Modal.Body className="body">
                <div className="form">
                    <Formik
                        validationSchema={updateSchema}
                        initialValues={{
                            name: currentAccount?.name,
                            email: currentAccount?.email,
                            password: "",
                            confirmPassword: "",
                            roleId: currentAccount?.roleId,
                            locationId: currentAccount?.locationId,
                        }}
                        onSubmit={(value) => handleUpdateSubmit(value)}
                        enableReinitialize
                    >
                        {(props) => (
                            <Form>
                                <div className="row">
                                    <fieldset className="form-group">
                                        <label htmlFor="name">Name</label>
                                        <Field
                                            type="text"
                                            name="name"
                                            className="form-control"
                                        />
                                        <ErrorMessage
                                            name="name"
                                            component="div"
                                            className="text-danger"
                                        />
                                    </fieldset>
                                </div>
                                <div className="row">
                                    <fieldset className="form-group pb-2">
                                        <label htmlFor="role" className="pb-1">Select Role</label>
                                        <Field as="select" name="roleId" className="form-control select-item">
                                            {roles && roles.map((val, idx) => (
                                                <option key={val.id} value={val.id}>{val.name}</option>
                                            ))}
                                        </Field>
                                        <ErrorMessage
                                            name="role"
                                            component="div"
                                            className="text-danger"
                                        />
                                    </fieldset>
                                    <fieldset className="form-group pb-2">
                                        <label htmlFor="location" className="pb-1">Select Location</label>
                                        <Field as="select" name="locationId" className="form-control select-item">
                                            {locations && locations.map((val, idx) => (
                                                <option key={val.id} value={val.id}>{val.name}</option>
                                            ))}
                                        </Field>
                                        <ErrorMessage
                                            name="location"
                                            component="div"
                                            className="text-danger"
                                        />
                                    </fieldset>
                                </div>
                                <div className="row">
                                    <fieldset className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <Field
                                            type="text"
                                            name="email"
                                            className="form-control"
                                        />
                                        <ErrorMessage
                                            name="email"
                                            component="div"
                                            className="text-danger"
                                        />
                                    </fieldset>
                                </div>
                                <div className="row">
                                    <fieldset className="form-group">
                                        <label htmlFor="password">Password</label>
                                        <Field
                                            type="password"
                                            name="password"
                                            className="form-control"
                                        />
                                        <ErrorMessage
                                            name="password"
                                            component="div"
                                            className="text-danger"
                                        />
                                    </fieldset>
                                </div>
                                <div className="row">
                                    <fieldset className="form-group">
                                        <label htmlFor="confirmPassword">Confirm Password</label>
                                        <Field
                                            type="password"
                                            name="confirmPassword"
                                            className="form-control"
                                        />
                                        <ErrorMessage
                                            name="confirmPassword"
                                            component="div"
                                            className="text-danger"
                                        />
                                    </fieldset>
                                </div>
                                <hr/>
                                <div className="button">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        Update Account
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </Modal.Body>
        </Modal>
    );
}
