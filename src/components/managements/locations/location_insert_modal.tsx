import React from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Modal} from "react-bootstrap";
import * as Yup from "yup";

import "@/styles/components/managements/companies/account_insert_modal.scss";
import {useDispatch, useSelector} from "react-redux";
import messageModalSlice from "@/slices/message_modal_slice";
import LocationService from "@/services/location_service";
import "@/styles/components/managements/locations/location_insert_modal.scss"
import Content from "@/models/value_objects/contracts/content";
import Location from "@/models/entities/location";
import pageSlice, {PageState} from "@/slices/page_slice";

const insertSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
});


export default function LocationInsertModalComponent() {
    const locationService = new LocationService()
    const pageState: PageState = useSelector((state: any) => state.page);
    const {currentLocations, currentCompany, isShowModal} = pageState.companyInformationManagement
    const dispatch = useDispatch();

    const handleShowModal = () => {
        dispatch(pageSlice.actions.configureCompanyInformationManagement({
            ...pageState.companyInformationManagement,
            isShowModal: !isShowModal
        }))
    };

    const handleInsertSubmit = (values: any, actions: any) => {
        locationService
            .createOne({
                body: {
                    companyId: currentCompany?.id,
                    name: values.name,
                    description: values.description,
                    address: values.address
                }
            })
            .then((response) => {
                const content: Content<Location> = response.data;
                dispatch(pageSlice.actions.configureCompanyInformationManagement({
                    ...pageState.companyInformationManagement,
                    currentLocations: [...(currentLocations || []), content.data]
                }))
                dispatch(messageModalSlice.actions.configure({
                    type: "succeed",
                    content: "Insert Location Succeed",
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

    return (
        <Modal
            show={isShowModal}
            onHide={handleShowModal}
            centered
            className="component location-insert-modal"
        >
            <Modal.Header closeButton className="header">
                <Modal.Title>Insert Location</Modal.Title>
            </Modal.Header>

            <Modal.Body className="body">
                <div className="main form">
                    <Formik
                        validationSchema={insertSchema}
                        initialValues={{
                            name: "",
                            description: "",
                            address: ""
                        }}
                        onSubmit={handleInsertSubmit}
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
                                    <fieldset className="form-group">
                                        <label htmlFor="description">Description</label>
                                        <Field
                                            type="text"
                                            name="description"
                                            className="form-control"
                                        />
                                        <ErrorMessage
                                            name="description"
                                            component="div"
                                            className="text-danger"
                                        />
                                    </fieldset>
                                </div>
                                <div className="row">
                                    <fieldset className="form-group">
                                        <label htmlFor="address">Address</label>
                                        <Field
                                            type="text"
                                            name="address"
                                            className="form-control"
                                        />
                                        <ErrorMessage
                                            name="address"
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
