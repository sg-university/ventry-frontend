import React from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Modal} from "react-bootstrap";
import * as Yup from "yup";
import {useDispatch, useSelector} from "react-redux";
import pageSlice, {PageState} from "@/slices/page_slice";
import Image from "next/image";
import ItemCardImage from "@/assets/images/item_management_card.svg";
import "@/styles/components/managements/pos/checkout_modal.scss"

const checkoutSchema = Yup.object().shape({
    totalPrice: Yup.number().required("Required"),
    paymentMethod: Yup.string().required("Required"),
});


export default function ItemUpdateModalComponent() {
    const pageState: PageState = useSelector((state: any) => state.page);
    const {isShowModal} = pageState.pointOfSaleManagement;
    const dispatch = useDispatch();
    const handleShow = () => {
        dispatch(pageSlice.actions.configureItemManagement({
            ...pageState.itemManagement,
            isShowModal: !isShowModal,
        }));
    }
    const handleSubmitCheckout = (values: any) => {
        console.log(values);
    }
    const handleSelectModalMenu = (eventKey: string | null) => {
        dispatch(pageSlice.actions.configureItemManagement({...pageState.itemManagement, currentModalMenu: eventKey}))
    }
    return (
        <Modal show={isShowModal} onHide={() => handleShow()} centered className="component item-update-modal">
            <Modal.Header closeButton className="header">
                <Modal.Title>Item Update</Modal.Title>
            </Modal.Header>
            <Modal.Body className="body">
                <div className="form">
                    <Formik validationSchema={checkoutSchema}
                            initialValues={{
                                "totalPrice": 0,
                                "paymentMethod": "cash"
                            }}
                            onSubmit={handleSubmitCheckout}
                            enableReinitialize
                    >
                        {(props) => (
                            <Form>
                                <div className="row">
                                    <fieldset className="form-group"><label htmlFor="code">Code</label>
                                        <Field type="text" name="code" className="form-control"/>
                                        <ErrorMessage name="code" component="div" className="text-danger"/>
                                    </fieldset>
                                    <fieldset className="form-group"><label htmlFor="type">Type</label>
                                        <Field type="text" name="type" className="form-control"/>
                                        <ErrorMessage name="type" component="div" className="text-danger"/>
                                    </fieldset>
                                </div>
                                <div className="row">
                                    <fieldset className="form-group"><label htmlFor="name">Name</label>
                                        <Field type="text" name="name" className="form-control"/>
                                        <ErrorMessage name="name" component="div" className="text-danger"/>
                                    </fieldset>
                                </div>
                                <div className="row">
                                    <fieldset className="form-group"><label htmlFor="quantity">Quantity</label>
                                        <Field type="number" name="quantity" className="form-control"/>
                                        <ErrorMessage name="quantity" component="div" className="text-danger"/>
                                    </fieldset>
                                    <fieldset className="form-group"><label htmlFor="unitName">Unit Name</label>
                                        <Field type="text" name="unitName" className="form-control"/>
                                        <ErrorMessage name="unitName" component="div" className="text-danger"/>
                                    </fieldset>
                                </div>
                                <div className="row">
                                    <fieldset className="form-group"><label htmlFor="unitCostPrice">Cost</label>
                                        <Field
                                            type="number" name="unitCostPrice" className="form-control"/>
                                        <ErrorMessage name="unitCostPrice" component="div" className="text-danger"/>
                                    </fieldset>
                                    <fieldset className="form-group"><label htmlFor="unitSellPrice">Price</label>
                                        <Field
                                            type="number" name="unitSellPrice" className="form-control"/>
                                        <ErrorMessage name="unitSellPrice" component="div" className="text-danger"/>
                                    </fieldset>
                                </div>
                                <div className="row">
                                    <fieldset className="form-group"><label htmlFor="description">Description</label>
                                        <Field
                                            as="textarea" type="text" name="description" className="form-control"/>
                                        <ErrorMessage name="description" component="div" className="text-danger"/>
                                    </fieldset>
                                </div>
                                <div className="row">
                                    <fieldset className="form-group">
                                        <div className="image"> Image:{" "} <Image src={ItemCardImage} alt="item"/>
                                        </div>
                                    </fieldset>
                                </div>
                                <div className="row">
                                    <div className="is_record">
                                        <Field
                                            type="checkbox" id="is_record" name="is_record"
                                            className="form-check-input "/>
                                        <label htmlFor="is_record" className="is_record_label">
                                            Is record to Inventory Control History?
                                        </label>
                                    </div>
                                </div>
                                <hr/>
                                <div className="button">
                                    <button type="submit" className="btn btn-primary">
                                        Pay
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={() => handleShow()}>
                                        Close
                                    </button>
                                </div>
                            </Form>
                        )
                        }
                    </Formik>
                </div>
            </Modal.Body>
        </Modal>
    );
}