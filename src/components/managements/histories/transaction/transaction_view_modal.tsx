import React, {useState} from "react";
import {Modal} from "react-bootstrap";

import {useDispatch, useSelector} from "react-redux";
import TransactionService from "@/services/transaction_service";
import DeleteOneByIdRequest
    from "@/models/value_objects/contracts/requests/managements/transactions/delete_one_by_id_request";
import messageModalSlice from "@/slices/message_modal_slice";
import pageSlice, {PageState} from "@/slices/page_slice";
import "@/styles/components/managements/histories/transactions/transaction_view_modal.scss"
import Transaction from "@/models/entities/transaction";
import Content from "@/models/value_objects/contracts/content";
import { AxiosResponse } from "axios";
import TransactionItemMap from "@/models/entities/transaction_item_map";
import TransactionItemMapService from "@/services/transaction_item_map_service";

export default function TransactionViewModalComponent() {
    const transactionService = new TransactionService()
    const transactionItemMapService = new TransactionItemMapService();
    const pageState: PageState = useSelector((state: any) => state.page);
    const { isShowModal, transaction, transactionItems } = pageState.transactionManagement
    const items = pageState.itemManagement.items
    const transactionItem = transactionItems?.filter((itm) => itm.transactionId === transaction.id)
    const transactionItemData = transactionItem?.map(item1 => ({item: items?.find(item2 => item2.id === item1.itemId), ...item1}))
    const dispatch = useDispatch();

    const getAllTransactions = async () => {
        transactionService
            .readAll()
            .then((result: AxiosResponse<Content<Transaction[]>>) => {
                const transactions = result.data;
                getAllTransactionItems(transactions.data)
            })
            .catch((error) => {
                console.log(error)
            });
    }

    const getAllTransactionItems = (transactions: Transaction[]) => {
        transactionItemMapService
            .readAll()
            .then((result: AxiosResponse<Content<TransactionItemMap[]>>) => {
                const transactionItems = result.data;
                dispatch(pageSlice.actions.configureTransactionManagement({
                    ...pageState.transactionManagement,
                    transactions: transactions,
                    transactionItems: transactionItems.data,
                    currentModal: "noModal",
                    isShowModal: false
                })) 
            })
            .catch((error) => {
                console.log(error)
            });
    }

    const handleShowModal = () => {
        dispatch(pageSlice.actions.configureTransactionManagement({
            ...pageState.transactionManagement,
            isShowModal: !isShowModal,
        }))
    }

    const handleModalUpdate = () => {
        dispatch(pageSlice.actions.configureTransactionManagement({
            ...pageState.transactionManagement,
            currentModal: "updateModal",
            isShowModal: true,
        }))
    }

    const handleModalDelete = () => {
        const request: DeleteOneByIdRequest = {
            id: transaction.id
        }
        transactionService
            .deleteOneById(request)
            .then(() => {
                dispatch(messageModalSlice.actions.configure({
                    type: "succeed",
                    content: "Delete Transaction Succeed",
                    isShow: true
                }))
                getAllTransactions()
            }).catch((error) => {
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
            className="component product-view-modal"
        >
            <Modal.Header closeButton className="header">
                <Modal.Title>Item Transaction Details</Modal.Title>
            </Modal.Header>

            <Modal.Body className="body">
              <div className="main">
                  <div className="id">
                      <div className="text">{`ID: ${transaction.id}`}</div>
                  </div>
                  <div className="timestamp">
                      <div className="text">{`Date: ${convertDate(transaction.timestamp)}`}</div>
                  </div>
                  <div className="sellPrice">
                      <div className="text">{`Total Price: Rp. ${transaction.sellPrice}`}</div>
                  </div>
                  <div className="column">
                      <div className="table-p">
                          <table className="table">
                              <thead>
                              <tr>
                                  <th scope="col" className="col-code">Code</th>
                                  <th scope="col" className="col-name">Name</th>
                                  <th scope="col" className="col-price">Price</th>
                                  <th scope="col" className="col-quantity">Quantity</th>
                              </tr>
                              </thead>
                              <tbody>
                              {transactionItemData && transactionItemData.map((val, idx) => {
                                  return (
                                      <tr key={idx}>
                                          <td>{val.item.code}</td>
                                          <td>{val.item.name}</td>
                                          <td>Rp. {val.sellPrice}</td>
                                          <td>{val.quantity}</td>
                                      </tr>
                                  );
                              })}
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
            </Modal.Body>

            <Modal.Footer className="footer">
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleModalUpdate}
                >
                    Update
                </button>
                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleModalDelete}
                >
                    Delete
                </button>
            </Modal.Footer>
        </Modal>
    );
}
