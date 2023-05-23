import React from "react";
import {Field, Form, Formik, FormikProps} from "formik";
import {Modal} from "react-bootstrap";
import pageSlice, {PageState} from "@/slices/page_slice";
import {useDispatch, useSelector} from "react-redux";
import "@/styles/components/managements/histories/transactions/transaction_insert_modal.scss"
import Content from "@/models/value_objects/contracts/content";
import messageModalSlice from "@/slices/message_modal_slice";
import TransactionService from "@/services/transaction_service";
import Transaction from "@/models/entities/transaction";
import TransactionItemMapService from "@/services/transaction_item_map_service";
import TransactionItemMap from "@/models/entities/transaction_item_map";
import Item from "@/models/entities/item";
import {AuthenticationState} from "@/slices/authentication_slice";
import moment from "moment";

type FormikInitialValues = {
    transactionTimestamp: string
    newTransactionItemMaps: TransactionItemMap[]
}


export default function TransactionUpdateModalComponent() {
    const transactionService = new TransactionService()
    const transactionItemMapService = new TransactionItemMapService();
    const authenticationState: AuthenticationState = useSelector((state: any) => state.authentication);
    const {currentAccount} = authenticationState;
    const pageState: PageState = useSelector((state: any) => state.page);
    const {
        isShowModal,
        transactionItemMaps,
        transactions,
        items,
    } = pageState.transactionHistoryManagement
    const dispatch = useDispatch()

    const handleSubmitInsert = (values: FormikInitialValues) => {
        const newTransactionItemMaps: TransactionItemMap[] = values.newTransactionItemMaps
        const totalSellPrice: number = newTransactionItemMaps!.reduce((total, tim) => total + (tim.sellPrice! * tim.quantity!), 0)

        transactionService
            .createOne({
                body: {
                    accountId: currentAccount!.id,
                    sellPrice: totalSellPrice,
                    timestamp: new Date().toISOString()
                }
            }).then((response) => {
            const transactionContent: Content<Transaction> = response.data;

            Promise.all([
                    ...newTransactionItemMaps.filter(tim => tim.quantity! > 0 && tim.sellPrice! > 0).map(tim =>
                        transactionItemMapService
                            .createOne({
                                body: {
                                    itemId: tim.itemId!,
                                    quantity: tim.quantity!,
                                    sellPrice: tim.sellPrice!,
                                    transactionId: transactionContent.data.id!
                                }
                            })
                    )
                ]
            ).then((response) => {
                const transactionItemMapContents: Content<TransactionItemMap>[] = response.map((res) => res.data)

                dispatch(pageSlice.actions.configureTransactionHistoryManagement({
                    ...pageState.transactionHistoryManagement,
                    currentTransaction: transactionContent.data,
                    transactions: [transactionContent.data, ...transactions!],
                    transactionItemMaps: [
                        ...transactionItemMapContents.map((tim) => tim.data), ...transactionItemMaps!
                    ],
                    currentTransactionItemMaps: transactionItemMapContents.map((tim) => tim.data),
                    isShowModal: !isShowModal,
                }))
                dispatch(messageModalSlice.actions.configure({
                    type: "succeed",
                    content: "Insert Transaction succeed.",
                    isShow: true
                }))
            }).catch((error) => {
                console.log(error)
                dispatch(messageModalSlice.actions.configure({
                    type: "failed",
                    content: error.message,
                    isShow: true
                }))
            });
        })
    }

    const handleShowModal = () => {
        dispatch(pageSlice.actions.configureTransactionHistoryManagement({
            ...pageState.transactionHistoryManagement,
            isShowModal: !isShowModal,
        }))
    }

    const getNewTransactionItemMapQuantity = (value: Item, props: FormikProps<FormikInitialValues>): string => {
        const newTransactionItemMaps: TransactionItemMap[] = props.values.newTransactionItemMaps
        const index: number = newTransactionItemMaps.findIndex((tim) => tim.itemId === value.id)
        return `newTransactionItemMaps[${index}].quantity`
    }

    const getNewTransactionItemMapSellPrice = (value: Item, props: FormikProps<FormikInitialValues>): string => {
        const newTransactionItemMaps: TransactionItemMap[] = props.values.newTransactionItemMaps
        const index: number = newTransactionItemMaps.findIndex((tim) => tim.itemId === value.id)
        return `newTransactionItemMaps[${index}].sellPrice`
    }

    const handleChangeNewTransactionItemMapQuantity = (event: any, props: FormikProps<FormikInitialValues>, value: Item) => {
        if (event.target.value < 0) {
            dispatch(messageModalSlice.actions.configure({
                type: "failed",
                content: "Quantity must be greater than or equal to 0.",
                isShow: true
            }))
            return
        }

        props.handleChange(event)
        props.setFieldValue(
            "newTransactionItemMaps",
            props.values.newTransactionItemMaps.map((tim) => {
                    if (tim.itemId === value.id) {
                        return {
                            ...tim,
                            quantity: event.target.value,
                            sellPrice: value.unitSellPrice * event.target.value
                        }
                    } else {
                        return tim
                    }
                }
            )
        )
    }

    const formikInitialValues: FormikInitialValues = {
        transactionTimestamp: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
        newTransactionItemMaps: items!.map((item) => {
            return {
                id: undefined,
                quantity: 0,
                transactionId: undefined,
                itemId: item.id,
                sellPrice: 0,
                createdAt: undefined,
                updatedAt: undefined
            }
        })
    }

    return (
        <Modal
            size="xl"
            show={isShowModal}
            onHide={handleShowModal}
            centered
            className="component transaction-history-insert-modal"
        >
            <Modal.Header closeButton className="header">
                <Modal.Title>Insert Transaction History</Modal.Title>
            </Modal.Header>

            <Modal.Body className="body">
                <div className="main ">
                    <div className="form">
                        <Formik
                            initialValues={formikInitialValues}
                            onSubmit={handleSubmitInsert}
                            enableReinitialize
                        >
                            {
                                (props) => (
                                    <Form>
                                        <div className="transaction-timestamp">
                                            <Field
                                                className="form-control"
                                                type="datetime-local"
                                                name="transactionTimestamp"
                                            />
                                        </div>
                                        <div className="new-transaction-item-maps">
                                            <table className="table ">
                                                <thead>
                                                <tr>
                                                    <th>Item ID</th>
                                                    <th>Code</th>
                                                    <th>Name</th>
                                                    <th>Price</th>
                                                    <th>Quantity</th>
                                                    <th>Sell Price</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {items!.map((value, index) => {
                                                    return (
                                                        <tr key={value.id}>
                                                            <td>{value.id}</td>
                                                            <td>{value.code}</td>
                                                            <td>{value.name}</td>
                                                            <td>Rp. {value.unitSellPrice}</td>
                                                            <td>
                                                                <Field
                                                                    type="number"
                                                                    name={getNewTransactionItemMapQuantity(value, props)}
                                                                    className="form-control"
                                                                    onChange={(event: any) => handleChangeNewTransactionItemMapQuantity(event, props, value)}
                                                                />
                                                            </td>
                                                            <td>
                                                                <Field
                                                                    type="number"
                                                                    name={getNewTransactionItemMapSellPrice(value, props)}
                                                                    className="form-control"
                                                                />
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                                </tbody>
                                            </table>
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
                                )
                            }
                        </Formik>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}
