import React from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Modal} from "react-bootstrap";
import * as Yup from "yup";

import "@/styles/components/managements/histories/inventory_controls/inventory_control_insert_modal.scss";
import pageSlice, {PageState} from "@/slices/page_slice";
import {useDispatch, useSelector} from "react-redux";
import InventoryControlService from "@/services/inventory_control_service";
import messageModalSlice from "@/slices/message_modal_slice";
import InventoryControl from "@/models/entities/inventory_control";
import Content from "@/models/value_objects/contracts/content";

const insertSchema = Yup.object().shape({
    quantityBefore: Yup.number().required("Required"),
    quantityAfter: Yup.number().required("Required"),
});

export default function InventoryControlInsertModalComponent() {
    const inventoryControlService = new InventoryControlService();
    const pageState: PageState = useSelector((state: any) => state.page);
    const {
        isShowModal,
        currentItem,
        accountItems,
        accountInventoryControls
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

    const handleInsertSubmit = (values: any, actions: any) => {
        inventoryControlService.createOne({
            body: {
                accountId: currentAccount?.id,
                itemId: currentItem?.id,
                quantityBefore: values.quantityBefore,
                quantityAfter: values.quantityAfter,
                timestamp: new Date().toISOString()
            }
        }).then((response) => {
            const content: Content<InventoryControl> = response.data;
            dispatch(messageModalSlice.actions.configure({
                type: "succeed",
                content: content.message,
                isShow: true
            }))
            dispatch(pageSlice.actions.configureInventoryControlHistoryManagement({
                ...pageState.inventoryControlHistoryManagement,
                accountInventoryControls: [...(accountInventoryControls || []), content.data],
            }))
        }).catch((error) => {
            console.log(error)
            dispatch(messageModalSlice.actions.configure({
                type: "failed",
                content: error.message,
                isShow: true
            }))
        }).finally(() => {
            actions.setSubmitting(false);
        });
    }

    const handleClickSelect = (item: any) => {
        dispatch(pageSlice.actions.configureInventoryControlHistoryManagement({
            ...pageState.inventoryControlHistoryManagement,
            currentItem: item
        }))
    }

    const handleClickDelete = () => {
        dispatch(pageSlice.actions.configureInventoryControlHistoryManagement({
            ...pageState.inventoryControlHistoryManagement,
            currentItem: undefined
        }))
    }

    return (
        <Modal
            show={isShowModal}
            onHide={handleShowModal}
            centered
            className="component item-insert-modal"
        >
            <Modal.Header closeButton className="header">
                <Modal.Title>Insert Inventory Control</Modal.Title>
            </Modal.Header>

            <Modal.Body className="body">
                <div className="main ">
                    <div className="form">
                        <Formik
                            validationSchema={insertSchema}
                            initialValues={{
                                quantityBefore: currentItem ? currentItem.quantity : 0,
                                quantityAfter: 0,
                            }}
                            onSubmit={handleInsertSubmit}
                            enableReinitialize
                        >
                            {(props) => (
                                <Form>
                                    <div className="column">
                                        <div className="table-p">
                                            <table className="table ">
                                                <thead>
                                                <tr>
                                                    <th scope="col">Item ID</th>
                                                    <th scope="col">Code</th>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Action</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {accountItems?.map((value, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{value.id}</td>
                                                            <td>{value.code}</td>
                                                            <td>{value.name}</td>
                                                            <td>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-primary"
                                                                    onClick={() => handleClickSelect(value)}
                                                                >
                                                                    Select
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="table-sp">
                                            <table className="table ">
                                                <thead>
                                                <tr>
                                                    <th scope="col">Selected Item ID</th>
                                                    <th scope="col">Code</th>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Action</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    {
                                                        currentItem && (
                                                            <>
                                                                <td>{currentItem.id}</td>
                                                                <td>{currentItem.code}</td>
                                                                <td>{currentItem.name}</td>
                                                                <td>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-outline-primary"
                                                                        onClick={() => handleClickDelete()}
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </td>
                                                            </>
                                                        )
                                                    }
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <ErrorMessage
                                            name="item_id"
                                            component="div"
                                            className="text-danger"
                                        />
                                    </div>
                                    <div className="row">
                                        <fieldset className="form-group">
                                            <label htmlFor="quantityBefore">Item Quantity Before</label>
                                            <Field
                                                type="number"
                                                name="quantityBefore"
                                                className="form-control"
                                                disabled
                                            />
                                            <ErrorMessage
                                                name="quantity"
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
                                            Insert
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
