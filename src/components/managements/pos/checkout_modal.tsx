import React from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Modal} from "react-bootstrap";
import * as Yup from "yup";
import {useDispatch, useSelector} from "react-redux";
import pageSlice, {PageState} from "@/slices/page_slice";
import "@/styles/components/managements/pos/checkout_modal.scss"
import TransactionService from "@/services/transaction_service";
import TransactionItemMapService from "@/services/transaction_item_map_service";
import InventoryControlService from "@/services/inventory_control_service";
import messageModalSlice from "@/slices/message_modal_slice";
import ItemService from "@/services/item_service";
import {AuthenticationState} from "@/slices/authentication_slice";
import Content from "@/models/value_objects/contracts/content";
import CheckoutResponse from "@/models/value_objects/contracts/response/managements/transactions/checkout_response";

const checkoutSchema = Yup.object().shape({
    totalPrice: Yup.number().required("Required"),
    paymentMethod: Yup.string().required("Required"),
    isRecord: Yup.boolean().required("Required"),
});


export default function CheckoutModalComponent() {
    const itemService = new ItemService();
    const transactionService = new TransactionService();
    const transactionItemMapService = new TransactionItemMapService();
    const inventoryControlService = new InventoryControlService();
    const pageState: PageState = useSelector((state: any) => state.page);
    const {isShowModal, transaction, transactionItemMaps, items} = pageState.pointOfSaleManagement;
    const authenticationState: AuthenticationState = useSelector((state: any) => state.authentication);
    const {currentAccount} = authenticationState
    const dispatch = useDispatch();
    const handleShow = () => {
        dispatch(pageSlice.actions.configurePointOfSaleManagement({
            ...pageState.pointOfSaleManagement,
            isShowModal: !isShowModal,
        }));
    }

    const handleSubmitCheckout = (values: any) => {
        transactionService.checkout({
            body: {
                transaction: {
                    accountId: transaction?.accountId,
                    sellPrice: transaction?.sellPrice!,
                    timestamp: new Date().toISOString()
                },
                transactionItemMaps: transactionItemMaps!.map((tim) => {
                    return {
                        itemId: tim.itemId,
                        quantity: tim.quantity,
                        sellPrice: items!.find((item) => item.id === tim.itemId)!.unitSellPrice
                    }
                }),
                isRecordToInventoryControls: values.isRecord
            },
        }).then((response) => {
            const content: Content<CheckoutResponse> = response.data;
            dispatch(pageSlice.actions.configurePointOfSaleManagement({
                ...pageState.pointOfSaleManagement,
                items: items?.map((item) => {
                    const tim = transactionItemMaps?.find((tim) => tim.itemId === item.id)
                    if (tim) {
                        return {
                            ...item,
                            quantity: item.quantity! - tim.quantity!
                        }
                    } else {
                        return item
                    }
                }),
                transaction: {
                    id: undefined,
                    accountId: currentAccount?.id,
                    sellPrice: 0,
                    timestamp: undefined,
                    createdAt: undefined,
                    updatedAt: undefined,
                },
                transactionItemMaps: [],
            }))

            dispatch(messageModalSlice.actions.configure({
                type: "succeed",
                content: content.message,
                isShow: true
            }))

        }).catch((error) => {
            console.log(error)
            dispatch(messageModalSlice.actions.configure({
                type: "failed",
                content: error.message,
                isShow: true
            }))
        })

    }

    return (
        <Modal show={isShowModal} onHide={() => handleShow()} centered className="component checkout-modal">
            <Modal.Header closeButton className="header">
                <Modal.Title>Checkout</Modal.Title>
            </Modal.Header>
            <Modal.Body className="body">
                <div className="form">
                    <Formik
                        validationSchema={checkoutSchema}
                        initialValues={{
                            "totalPrice": 0,
                            "paymentMethod": "cash",
                            "isRecord": true    
                        }}
                        onSubmit={handleSubmitCheckout}
                        enableReinitialize
                    >
                        {
                            (props) => (
                                <Form>
                                    <div className="row">
                                        <fieldset className="form-group">
                                            <label htmlFor="paymentMethod">Payment Method</label>
                                            <Field as="select" name="paymentMethod" className="form-control"
                                                   disabled>
                                                <option selected value="cash">Cash</option>
                                            </Field>
                                            <ErrorMessage name="paymentMethod" component="div"
                                                          className="text-danger"/>
                                        </fieldset>
                                    </div>
                                    <div className="row">
                                        <fieldset className="form-group isRecord">
                                            <Field
                                                type="checkbox" id="isRecord" name="isRecord"
                                                className="form-check-input"/>
                                            <label htmlFor="isRecord">
                                                Is record it to Inventory Control History?
                                            </label>
                                        </fieldset>
                                    </div>
                                    <hr/>
                                    <div className="button">
                                        <button type="submit" className="btn btn-primary">
                                            Pay
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