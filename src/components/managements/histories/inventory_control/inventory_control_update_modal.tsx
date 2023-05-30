import React from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Modal} from "react-bootstrap";
import * as Yup from "yup";

import {useDispatch, useSelector} from "react-redux";
import "@/styles/components/managements/histories/inventory_controls/inventory_control_update_modal.scss"
import pageSlice, {PageState} from "@/slices/page_slice";
import InventoryControlService from "@/services/inventory_control_service";
import InventoryControl from "@/models/entities/inventory_control";
import Content from "@/models/value_objects/contracts/content";
import messageModalSlice from "@/slices/message_modal_slice";

const updateSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    quantityBefore: Yup.number().required("Required"),
    quantityAfter: Yup.number().required("Required"),
});

export default function InventoryControlUpdateModalComponent() {
    const inventoryControlService = new InventoryControlService()
    const pageState: PageState = useSelector((state: any) => state.page);
    const {
        isShowModal,
        currentInventoryControl,
        accountInventoryControls,
        currentItem
    } = pageState.inventoryControlHistoryManagement
    const authenticationState = useSelector((state: any) => state.authentication);
    const {currentAccount} = authenticationState;
    const dispatch = useDispatch();

    const handleShowModal = () => {
        dispatch(pageSlice.actions.configureInventoryControlHistoryManagement({
            ...pageState.inventoryControlHistoryManagement,
            isShowModal: !isShowModal,
        }))
    }
    const handleSubmitUpdate = (values: any, actions: any) => {
        console.log(values)
        inventoryControlService
            .patchOneById({
                id: currentInventoryControl?.id,
                body: {
                    accountId: currentAccount?.id,
                    itemId: currentInventoryControl?.itemId,
                    quantityBefore: values.quantityBefore,
                    quantityAfter: values.quantityAfter,
                    timestamp: new Date().toISOString()
                }
            })
            .then((response) => {
                const content: Content<InventoryControl> = response.data
                dispatch(messageModalSlice.actions.configure({
                    type: "succeed",
                    content: "Update Inventory Control succeed.",
                    isShow: true
                }))
                dispatch(pageSlice.actions.configureInventoryControlHistoryManagement({
                    ...pageState.inventoryControlHistoryManagement,
                    currentInventoryControl: content.data,
                    accountInventoryControls: accountInventoryControls?.map((item) => {
                        if (item.id === content.data.id) {
                            return content.data
                        }
                        return item
                    })
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
    }

    return (
        <Modal
            show={isShowModal}
            onHide={handleShowModal}
            centered
            className="component item-update-modal"
        >
            <Modal.Header closeButton className="header">
                <Modal.Title>Update Inventory Control</Modal.Title>
            </Modal.Header>

            <Modal.Body className="body">
                <div className="main">
                    <div className="form">
                        <Formik
                            validationSchema={updateSchema}
                            initialValues={{
                                itemId: currentItem?.id,
                                itemName: currentItem?.name,
                                itemCode: currentItem?.code,
                                quantityBefore: currentInventoryControl?.quantityBefore,
                                quantityAfter: currentInventoryControl?.quantityAfter
                            }}
                            onSubmit={handleSubmitUpdate}
                            enableReinitialize
                        >
                            {(props) => (
                                <Form>
                                    <div className="row">
                                        <fieldset className="form-group">
                                            <label htmlFor="itemCode">Item ID</label>
                                            <Field
                                                type="text"
                                                name="itemId"
                                                className="form-control"
                                                disabled
                                            />
                                            <ErrorMessage
                                                name="itemId"
                                                component="div"
                                                className="text-danger"
                                            />
                                        </fieldset>
                                    </div>
                                    <div className="row">
                                        <fieldset className="form-group">
                                            <label htmlFor="itemCode">Item Code</label>
                                            <Field
                                                type="text"
                                                name="itemCode"
                                                className="form-control"
                                                disabled
                                            />
                                            <ErrorMessage
                                                name="itemCode"
                                                component="div"
                                                className="text-danger"
                                            />
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <label htmlFor="itemName">Item Name</label>
                                            <Field
                                                type="text"
                                                name="itemName"
                                                className="form-control"
                                                disabled
                                            />
                                            <ErrorMessage
                                                name="itemName"
                                                component="div"
                                                className="text-danger"
                                            />
                                        </fieldset>
                                    </div>
                                    <div className="row">
                                        <fieldset className="form-group">
                                            <label htmlFor="quantityBefore">Item Quantity Before</label>
                                            <Field
                                                type="number"
                                                name="quantityBefore"
                                                className="form-control"
                                            />
                                            <ErrorMessage
                                                name="quantityBefore"
                                                component="div"
                                                className="text-danger"
                                            />
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <label htmlFor="quantityAfter">Item Quantity After</label>
                                            <Field
                                                type="number"
                                                name="quantityAfter"
                                                className="form-control"
                                            />
                                            <ErrorMessage
                                                name="quantityAfter"
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
