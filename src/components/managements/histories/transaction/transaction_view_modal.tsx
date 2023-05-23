import React from "react";
import {Modal} from "react-bootstrap";

import {useDispatch, useSelector} from "react-redux";
import TransactionService from "@/services/transaction_service";
import messageModalSlice from "@/slices/message_modal_slice";
import pageSlice, {PageState} from "@/slices/page_slice";
import "@/styles/components/managements/histories/transactions/transaction_view_modal.scss"
import Content from "@/models/value_objects/contracts/content";
import Transaction from "@/models/entities/transaction";

export default function TransactionViewModalComponent() {
    const transactionService = new TransactionService()
    const pageState: PageState = useSelector((state: any) => state.page);
    const {
        isShowModal,
        transactions,
        currentTransaction,
        currentTransactionItemMaps,
        items
    } = pageState.transactionHistoryManagement
    const dispatch = useDispatch();

    const handleShowModal = () => {
        dispatch(pageSlice.actions.configureTransactionHistoryManagement({
            ...pageState.transactionHistoryManagement,
            isShowModal: !isShowModal,
        }))
    }

    const handleModalUpdate = () => {
        dispatch(pageSlice.actions.configureTransactionHistoryManagement({
            ...pageState.transactionHistoryManagement,
            currentModal: "updateModal",
            isShowModal: true,
        }))
    }

    const handleModalDelete = () => {
        transactionService
            .deleteOneById({
                id: currentTransaction!.id
            })
            .then((response) => {
                const content: Content<Transaction> = response.data
                dispatch(messageModalSlice.actions.configure({
                    type: "succeed",
                    content: "Delete Transaction succeed.",
                    isShow: true
                }))
                dispatch(pageSlice.actions.configureTransactionHistoryManagement({
                    ...pageState.transactionHistoryManagement,
                    transactions: transactions!.filter((transaction) => transaction.id !== content.data.id),
                    isShowModal: !isShowModal,
                }))
            })
            .catch((error) => {
                dispatch(messageModalSlice.actions.configure({
                    type: "failed",
                    content: error.message,
                    isShow: true
                }))
            })
    }

    const convertDate = (dateTime: string) => {
        const date = new Date(dateTime).toDateString()
        const time = new Date(dateTime).toLocaleTimeString()
        return date + " " + time
    }

    return (
        <Modal
            show={isShowModal}
            onHide={handleShowModal}
            centered
            className="component transaction-view-modal"
        >
            <Modal.Header closeButton className="header">
                <Modal.Title>Item Transaction Details</Modal.Title>
            </Modal.Header>

            <Modal.Body className="body">
                <div className="id">
                    <div className="text">{`ID: ${currentTransaction!.id}`}</div>
                </div>
                <div className="timestamp">
                    <div className="text">{`Date: ${convertDate(currentTransaction!.timestamp)}`}</div>
                </div>
                <div className="sell-price">
                    <div className="text">{`Total Price: Rp. ${currentTransaction!.sellPrice}`}</div>
                </div>
                <div className="transaction-item">
                    <div className="text">Transaction Item:</div>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentTransactionItemMaps!.map((value, index) => {
                            return (
                                <tr key={value.id}>
                                    <td>{items!.find(item => item.id == value.itemId)!.code}</td>
                                    <td>{items!.find(item => item.id == value.itemId)!.name}</td>
                                    <td>Rp. {value.sellPrice}</td>
                                    <td>{value.quantity}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </Modal.Body>

            <Modal.Footer className="footer">
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleModalUpdate()}
                >
                    Update
                </button>
                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleModalDelete()}
                >
                    Delete
                </button>
            </Modal.Footer>
        </Modal>
    );
}
