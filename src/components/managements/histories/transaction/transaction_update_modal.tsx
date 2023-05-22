import React, {useEffect, useState} from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Modal} from "react-bootstrap";
import pageSlice, {PageState} from "@/slices/page_slice";
import {useDispatch, useSelector} from "react-redux";
import "@/styles/components/managements/histories/transactions/transaction_update_modal.scss"
import Content from "@/models/value_objects/contracts/content";
import messageModalSlice from "@/slices/message_modal_slice";
import TransactionService from "@/services/transaction_service";
import Transaction from "@/models/entities/transaction";
import TransactionItemMapService from "@/services/transaction_item_map_service";
import PatchOneTransactionByIdRequest
    from "@/models/value_objects/contracts/requests/managements/transactions/patch_one_by_id_request";
import CreateOneRequest
    from "@/models/value_objects/contracts/requests/managements/transaction_item_maps/create_one_request";
import DeleteOneByIdRequest
    from "@/models/value_objects/contracts/requests/managements/transaction_item_maps/delete_one_by_id_request";
import { AxiosResponse } from "axios";
import TransactionItemMap from "@/models/entities/transaction_item_map";

export default function TransactionUpdateModalComponent() {
    const transactionService = new TransactionService()
    const transactionItemMapService = new TransactionItemMapService();
    const pageState: PageState = useSelector((state: any) => state.page);
    const { isShowModal, transaction, transactions, transactionItems } = pageState.transactionManagement
    const [selectedItem, setSelectedItem] = useState([] as Object[])
    const { items } = pageState.itemManagement
    const transactionItem = transactionItems?.filter((itm) => itm.transactionId === transaction.id)
    const transactionItemData = transactionItem?.map(item1 => ({item: items.find(item2 => item2.id === item1.itemId), ...item1}))
    const dispatch = useDispatch()

    const getAllTransactions = async (transaction: Transaction) => {
        transactionService
            .readAll()
            .then((result: AxiosResponse<Content<Transaction[]>>) => {
                const transactions = result.data;
                getAllTransactionItems(transaction, transactions.data, true)
            })
            .catch((error) => {
                console.log(error)
            });
    }

    const getAllTransactionItems = (transaction: Transaction | undefined, transactions: Transaction[] | undefined, toViewModal) => {
        transactionItemMapService
            .readAll()
            .then((result: AxiosResponse<Content<TransactionItemMap[]>>) => {
                const transactionItems = result.data;
                dispatch(pageSlice.actions.configureTransactionManagement({
                    ...pageState.transactionManagement,
                    transaction: transaction,
                    transactions: transactions,
                    transactionItems: transactionItems.data,
                    currentModal: toViewModal == true ? "viewModal" : "updateModal"
                })) 
            })
            .catch((error) => {
                console.log(error)
            });
    }

    const handleClickSelect = (item, quantity) => {
        if (!selectedItem.some(i => i.item.id === item.id)) {
            setSelectedItem([...selectedItem, {item, quantity}])
        }
    };

    const handleClickDelete = (val) => {
        setSelectedItem(selectedItem.filter(i => i.item.name != val.item.name))
        if (val.id) {
            const request: DeleteOneByIdRequest = {
                id: val.id
            }
            transactionItemMapService
                .deleteOneById(request)
                .then(() => {
                    getAllTransactionItems(transaction, transactions, false)
                })
                .catch((error) => {
                    console.log(error)
                    dispatch(messageModalSlice.actions.configure({
                        title: "Status",
                        type: "failed",
                        content: error.message,
                        isShow: true
                    }))
                });
        }
    };

    const calculateTransaction = async () => {
        let totalPrice = 0
        selectedItem.forEach(i => {
            totalPrice = totalPrice + (i.item.unitSellPrice * i.quantity)
        });

        return totalPrice
    }

    useEffect(() => {
        setSelectedItem(transactionItemData)
    }, [])


    const updateTransactionItem = async () => {
        selectedItem.forEach(i => {
            if (!i.id) {
                const request: CreateOneRequest = {
                    body: {
                        transactionId: transaction.id,
                        itemId: i.item.id,
                        sellPrice: i.item.unitSellPrice,
                        quantity: i.quantity
                    }
                }
                transactionItemMapService
                    .createOne(request)
                    .catch((error) => {
                        console.log(error)
                        dispatch(messageModalSlice.actions.configure({
                            title: "Status",
                            type: "failed",
                            content: error.message,
                            isShow: true
                        }))
                    });
            }
        });
    }

    const updateTransaction = async () => {
        const totalPrice = await calculateTransaction()
        const request: PatchOneTransactionByIdRequest = {
            id: transaction.id,
            body: {
                accountId: transaction.accountId,
                sellPrice: totalPrice,
                timestamp: transaction.timestamp
            }
        }
        transactionService
            .patchOneById(request)
            .then(async (response) => {
                const transaction: Content<Transaction> = response.data
                await getAllTransactions(transaction.data)
                dispatch(messageModalSlice.actions.configure({
                    type: "succeed",
                    content: "Update Transaction Succeed",
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
            });
    }

    const handleUpdateSubmit = () => {
        updateTransaction()
        updateTransactionItem()
    }

    const handleShowModal = () => {
        dispatch(pageSlice.actions.configureTransactionManagement({
            ...pageState.transactionManagement,
            isShowModal: !isShowModal,
        }))
    }

    return (
        <Modal
            show={isShowModal}
            onHide={handleShowModal}
            centered
            className="component product-update-modal"
        >
            <Modal.Header closeButton className="header">
                <Modal.Title>Update Transaction History</Modal.Title>
            </Modal.Header>

            <Modal.Body className="body">
                <div className="main ">
                    <div className="form">
                        <Formik
                            initialValues={{
                                quantity: 0,
                            }}
                            onSubmit={handleUpdateSubmit}
                            enableReinitialize
                        >
                            {(props) => (
                                <Form>
                                    <div className="column">
                                        <div className="quantity">
                                            Quantity : {selectedItem.length}
                                        </div>
                                        <div className="table-sp">
                                            <table className="table ">
                                                <thead>
                                                <tr>
                                                    <th scope="col">Selected Item ID</th>
                                                    <th scope="col">Code</th>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Quantity</th>
                                                    <th scope="col">Action</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {selectedItem.map((val, idx) => {
                                                    return (
                                                        <tr key={idx}>
                                                            <td>{val.item.id}</td>
                                                            <td>{val.item.code}</td>
                                                            <td>{val.item.name}</td>
                                                            <td>{val.quantity}</td>
                                                            <td>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-primary"
                                                                    onClick={() => handleClickDelete(val)}
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
                                        <ErrorMessage
                                            name="product_id"
                                            component="div"
                                            className="text-danger"
                                        />
                                        <div className="table-p">
                                            <table className="table">
                                                <thead>
                                                <tr>
                                                    <th scope="col">Code</th>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Price</th>
                                                    <th scope="col">Quantity</th>
                                                    <th scope="col">Action</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {pageState.itemManagement.items.map((val, idx) => {
                                                    return (
                                                        <tr key={idx}>
                                                            <td>{val.code}</td>
                                                            <td>{val.name}</td>
                                                            <td>{val.unitSellPrice}</td>
                                                            <td><Field type="number" name="quantity" className="form-control"/>
                                                            </td>
                                                            <td>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-primary"
                                                                    onClick={() => handleClickSelect(val, props.values.quantity)}
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
