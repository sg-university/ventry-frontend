import React, {useEffect} from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Modal} from "react-bootstrap";
import * as Yup from "yup";

import "@/styles/components/managements/companies/account_insert_modal.scss";
import pageSlice, {PageState} from "@/slices/page_slice";
import {useDispatch, useSelector} from "react-redux";
import messageModalSlice from "@/slices/message_modal_slice";
import RoleService from "@/services/role_service";
import Role from "@/models/entities/role";
import Content from "@/models/value_objects/contracts/content";
import LocationService from "@/services/location_service";
import Location from "@/models/entities/location";
import AccountService from "@/services/account_service";
import Account from "@/models/entities/account";

const insertSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    roleId: Yup.string().required("Required"),
    locationId: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
    confirmPassword: Yup.string()
        .required("Required")
        .oneOf([Yup.ref("password"), ""], "Passwords must match"),
});


export default function AccountInsertModalComponent() {
    const accountService: AccountService = new AccountService();
    const roleService: RoleService = new RoleService();
    const locationService: LocationService = new LocationService();
    const pageState: PageState = useSelector((state: any) => state.page);
    const {
        roles,
        companyAccounts,
        companyLocations,
        currentCompany,
        isShowModal,
    } = pageState.companyAccountManagement;
    const dispatch = useDispatch();

    useEffect(() => {
        fetchRolesAndCompanyLocations();
    }, [])

    const fetchRolesAndCompanyLocations = () => {
        Promise.all([
            roleService.readAll(),
            locationService.readAllByCompanyId({
                companyId: currentCompany?.id
            })
        ]).then((responses) => {
            const contentRoles: Content<Role[]> = responses[0].data;
            const contentLocations: Content<Location[]> = responses[1].data;
            dispatch(pageSlice.actions.configureCompanyAccountManagement({
                    ...pageState.companyAccountManagement,
                    roles: contentRoles.data,
                    companyLocations: contentLocations.data
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

    const handleSubmitInsert = (values: any, actions: any) => {
        accountService.createOne({
            body: {
                name: values.name,
                email: values.email,
                password: values.password,
                roleId: values.roleId,
                locationId: values.locationId,
            }
        }).then((response) => {
            const content: Content<Account> = response.data;
            dispatch(messageModalSlice.actions.configure({
                content: content.message,
                type: "succeed",
                isShow: true
            }))
            dispatch(pageSlice.actions.configureCompanyAccountManagement({
                ...pageState.companyAccountManagement,
                companyAccounts: [...(companyAccounts || []), content.data],
                isShowModal: false,
            }))
        }).catch((error) => {
            dispatch(messageModalSlice.actions.configure({
                type: "failed",
                content: error.message,
                isShow: true
            }))
        })
    }

    return (
        <Modal
            show={isShowModal}
            onHide={() => handleShowModal()}
            centered
            className="component account-insert-modal"
        >
            <Modal.Header closeButton className="header">
                <Modal.Title>Insert Account</Modal.Title>
            </Modal.Header>

            <Modal.Body className="body">
                <div className="main form">
                    <Formik
                        validationSchema={insertSchema}
                        initialValues={{
                            name: "",
                            roleId: roles ? roles[0].id : "",
                            locationId: companyLocations ? companyLocations[0].id : "",
                            email: "",
                            password: "",
                            confirmPassword: ""
                        }}
                        onSubmit={handleSubmitInsert}
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
                                        <label htmlFor="roleId" className="pb-1">Select Role</label>
                                        <Field as="select" name="roleId" className="form-control select-item">
                                            {roles?.map((value, index) => (
                                                <option key={value.id} value={value.id}>{value.name}</option>
                                            ))}
                                        </Field>
                                        <ErrorMessage
                                            name="roleId"
                                            component="div"
                                            className="text-danger"
                                        />
                                    </fieldset>
                                    <fieldset className="form-group pb-2">
                                        <label htmlFor="locationId" className="pb-1">Select Location</label>
                                        <Field as="select" name="locationId" className="form-control select-item">
                                            {companyLocations?.map((value, index) => (
                                                <option key={value.id} value={value.id}>{value.name}</option>
                                            ))}
                                        </Field>
                                        <ErrorMessage
                                            name="locationId"
                                            component="div"
                                            className="text-danger"
                                        />
                                    </fieldset>
                                </div>
                                <div className="row">
                                    <fieldset className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <Field
                                            type="email"
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
                                        Insert
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
