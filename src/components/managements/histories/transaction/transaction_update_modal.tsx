import React from "react";
import {Field, Form, Formik, FormikProps} from "formik";
import {Modal} from "react-bootstrap";
import pageSlice, {PageState} from "@/slices/page_slice";
import {useDispatch, useSelector} from "react-redux";
import "@/styles/components/managements/histories/transactions/transaction_update_modal.scss"
import Content from "@/models/value_objects/contracts/content";
import messageModalSlice from "@/slices/message_modal_slice";
import TransactionService from "@/services/transaction_service";
import Transaction from "@/models/entities/transaction";
import TransactionItemMapService from "@/services/transaction_item_map_service";
import TransactionItemMap from "@/models/entities/transaction_item_map";
import Item from "@/models/entities/item";
import moment from "moment";
import confirmationModalSlice from "@/slices/confirmation_modal_slice";

type FormikInitialValues = {
    transactionTimestamp: string
    currentTransactionItemMaps: TransactionItemMap[]
    newTransactionItemMaps: TransactionItemMap[]
}


export default function TransactionUpdateModalComponent() {
    const transactionService = new TransactionService()
    const transactionItemMapService = new TransactionItemMapService();
    const pageState: PageState = useSelector((state: any) => state.page);
    const {
        isShowModal,
        currentTransaction,
        currentTransactionItemMaps,
        transactionItemMaps,
        transactions,
        items,
    } = pageState.transactionHistoryManagement
    const dispatch = useDispatch()

    const handleClickDelete = (value: TransactionItemMap) => {
        const callback = () => {
            Promise.all([
                transactionService
                    .patchOneById({
                        id: currentTransaction!.id,
                        body: {
                            accountId: currentTransaction!.accountId,
                            sellPrice: currentTransaction!.sellPrice! - value.sellPrice!,
                            timestamp: currentTransaction!.timestamp
                        }
                    }),
                transactionItemMapService
                    .deleteOneById({
                        id: value.id
                    }),
            ]).then((response) => {
                const transactionContent: Content<Transaction> = response[0].data;
                const transactionItemMapContent: Content<TransactionItemMap> = response[1].data

                dispatch(messageModalSlice.actions.configure({
                    type: "succeed",
                    content: "Delete Transaction Item succeed.",
                    isShow: true
                }))
                dispatch(pageSlice.actions.configureTransactionHistoryManagement({
                    ...pageState.transactionHistoryManagement,
                    transactions: transactions!.map((transaction) => transaction.id === transactionContent.data.id ? transactionContent.data : transaction),
                    currentTransactionItemMaps: currentTransactionItemMaps!.filter((tim) => tim.id !== transactionItemMapContent.data.id),
                    transactionItemMaps: currentTransactionItemMaps!.filter((tim) => tim.id !== transactionItemMapContent.data.id),
                }))
            }).catch((error) => {
                console.log(error)
                dispatch(messageModalSlice.actions.configure({
                    type: "failed",
                    content: error.message,
                    isShow: true
                }))
            });
        }

        dispatch(confirmationModalSlice.actions.configure({
            isShow: true,
            content: "Are you sure want to delete this transaction item?",
            callback: callback
        }))
    };


    const handleSubmitUpdate = (values: FormikInitialValues) => {
        const newTransactionItemMaps: TransactionItemMap[] = values.newTransactionItemMaps
        const currentTransactionItemMaps: TransactionItemMap[] = values.currentTransactionItemMaps
        const allTransactionItemMaps: TransactionItemMap[] = [...currentTransactionItemMaps, ...newTransactionItemMaps]
        const totalSellPrice: number = allTransactionItemMaps!.reduce((total, tim) => total + tim.sellPrice!, 0)

        transactionService
            .patchOneById({
                id: currentTransaction!.id,
                body: {
                    accountId: currentTransaction!.accountId,
                    sellPrice: totalSellPrice,
                    timestamp: new Date(values.transactionTimestamp).toISOString()
                }
            }).then((response) => {
            const transactionContent: Content<Transaction> = response.data;

            Promise.all([
                    ...currentTransactionItemMaps.map(tim =>
                        transactionItemMapService
                            .patchOneById({
                                id: tim.id!,
                                body: {
                                    itemId: tim.itemId!,
                                    quantity: tim.quantity!,
                                    sellPrice: tim.sellPrice!,
                                    transactionId: tim.transactionId!
                                }
                            })
                    ),
                    ...newTransactionItemMaps.filter(tim => tim.quantity! > 0 && tim.sellPrice! > 0).map(tim =>
                        transactionItemMapService
                            .createOne({
                                body: {
                                    itemId: tim.itemId!,
                                    quantity: tim.quantity!,
                                    sellPrice: tim.sellPrice!,
                                    transactionId: tim.transactionId!
                                }
                            })
                    )
                ]
            ).then((response) => {
                const transactionItemMapContents: Content<TransactionItemMap>[] = response.map((res) => res.data)

                dispatch(pageSlice.actions.configureTransactionHistoryManagement({
                    ...pageState.transactionHistoryManagement,
                    currentTransaction: transactionContent.data,
                    transactions: transactions!.map((t) => {
                        if (t.id === transactionContent.data!.id) {
                            return transactionContent.data
                        } else {
                            return t
                        }
                    }),
                    transactionItemMaps: [
                        ...transactionItemMaps!.map((tim1) => {
                            const index: number = transactionItemMapContents.findIndex((tim2) => tim2.data.id === tim1.id)
                            if (index !== -1) {
                                return transactionItemMapContents[index].data
                            } else {
                                return tim1
                            }
                        }),
                        ...transactionItemMapContents.filter((tim1) => {
                            const index: number = transactionItemMaps!.findIndex((tim2) => tim2.id === tim1.data.id)
                            return index === -1
                        }).map((tim) => tim.data)
                    ],
                    currentTransactionItemMaps: transactionItemMapContents.map((tim) => tim.data),
                }))
                dispatch(messageModalSlice.actions.configure({
                    type: "succeed",
                    content: "Update Transaction succeed.",
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
            currentModal: "noModal"
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
        transactionTimestamp: moment(new Date(currentTransaction!.timestamp)).format("YYYY-MM-DDTHH:mm"),
        currentTransactionItemMaps: currentTransactionItemMaps!,
        newTransactionItemMaps: items!.map((item) => {
            return {
                id: undefined,
                quantity: 0,
                transactionId: currentTransaction!.id,
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
            className="component transaction-history-update-modal"
        >
            <Modal.Header closeButton className="header">
                <Modal.Title>Update Transaction History</Modal.Title>
            </Modal.Header>

            <Modal.Body className="body">
                <div className="form">
                    <Formik
                        initialValues={formikInitialValues}
                        onSubmit={handleSubmitUpdate}
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
                                    <div className="current-transaction-item-maps">
                                        <table className="table ">
                                            <thead>
                                            <tr>
                                                <th>Selected Item ID</th>
                                                <th>Code</th>
                                                <th>Name</th>
                                                <th>Price</th>
                                                <th>Quantity</th>
                                                <th>Sell Price</th>
                                                <th>Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {props.values.currentTransactionItemMaps!.map((value, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{items!.find(item => item.id === value.itemId)!.id}</td>
                                                        <td>{items!.find(item => item.id === value.itemId)!.code}</td>
                                                        <td>{items!.find(item => item.id === value.itemId)!.name}</td>
                                                        <td>Rp. {items!.find(item => item.id === value.itemId)!.unitSellPrice}</td>
                                                        <td>
                                                            <Field
                                                                type="number"
                                                                name={`currentTransactionItemMaps[${index}].quantity`}
                                                                className="form-control"
                                                                onChange={(event: any) => {
                                                                    props.handleChange(event)
                                                                    props.setFieldValue(
                                                                        `currentTransactionItemMaps[${index}].sellPrice`,
                                                                        event.target.value * items!.find(item => item.id === value.itemId)!.unitSellPrice
                                                                    )
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Field
                                                                type="number"
                                                                name={`currentTransactionItemMaps[${index}].sellPrice`}
                                                                className="form-control"
                                                            />
                                                        </td>
                                                        <td>
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-primary"
                                                                onClick={() => handleClickDelete(value)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                        </table>
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
                                            Update
                                        </button>
                                    </div>
                                </Form>
                            )
                        }
                    </Formik>
                </div>
            </Modal.Body>
        </Modal>
    )
}
