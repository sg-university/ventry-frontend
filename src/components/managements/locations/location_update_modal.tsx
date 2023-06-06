import React from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Modal} from "react-bootstrap";
import * as Yup from "yup";

import {useDispatch, useSelector} from "react-redux";
import messageModalSlice from "@/slices/message_modal_slice";
import LocationService from "@/services/location_service";
import "@/styles/components/managements/locations/location_update_modal.scss"
import Location from "@/models/entities/location";
import Content from "@/models/value_objects/contracts/content";
import pageSlice, {PageState} from "@/slices/page_slice";

const updateSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
});

export default function LocationUpdateModalComponent() {
    const locationService = new LocationService()
    const pageState: PageState = useSelector((state: any) => state.page);
    const {currentLocations, currentLocation, isShowModal} = pageState.companyInformationManagement
    const dispatch = useDispatch();

    const handleSubmitUpdate = (values: any, actions: any) => {
        locationService
            .patchOneById({
                id: currentLocation?.id,
                body: {
                    companyId: currentLocation?.companyId,
                    name: values.name,
                    description: values.description,
                    address: values.address
                }
            })
            .then((response) => {
                const content: Content<Location> = response.data;
                dispatch(pageSlice.actions.configureCompanyInformationManagement({
                    ...pageState.companyInformationManagement,
                    currentLocation: content.data,
                    currentLocations: currentLocations?.map((item) => {
                        if (item.id === content.data.id) {
                            return content.data
                        }
                        return item
                    })
                }))
                dispatch(messageModalSlice.actions.configure({
                    type: "succeed",
                    content: "Update Location succeed.",
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

    const handleShowModal = () => {
        dispatch(pageSlice.actions.configureCompanyInformationManagement({
            ...pageState.companyInformationManagement,
            isShowModal: !isShowModal,
            currentModal: "noModal"
        }))
    };

    return (
        <Modal
            show={isShowModal}
            onHide={handleShowModal}
            centered
            className="component location-update-modal"
        >
            <Modal.Header closeButton className="header">
                <Modal.Title>Update Company Location</Modal.Title>
            </Modal.Header>

            <Modal.Body className="body">
                <div className="main">
                    <div className="form">
                        <Formik
                            validationSchema={updateSchema}
                            initialValues={{
                                name: currentLocation?.name,
                                description: currentLocation?.description,
                                address: currentLocation?.address
                            }}
                            onSubmit={handleSubmitUpdate}
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
                                            Update
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}
