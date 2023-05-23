import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import Image from "next/image";
import {AxiosResponse} from "axios";
import pageSlice, {PageState} from "@/slices/page_slice";
import TransactionService from "@/services/transaction_service";
import Transaction from "@/models/entities/transaction";
import Item from "@/models/entities/item";
import ItemService from "@/services/item_service";
import Content from "@/models/value_objects/contracts/content";
import MessageModal from "@/components/message_modal";
import Authenticated from "@/layouts/authenticated";
import ButtonPlusImage from "@/assets/images/control_button_plus.svg";
import ProductCardImage from "@/assets/images/product_management_card.svg";
import TransactionInsertModalComponent from "@/components/managements/histories/transaction/transaction_insert_modal";
import TransactionViewModalComponent from "@/components/managements/histories/transaction/transaction_view_modal";
import "@/styles/pages/managements/histories/transaction.scss"
import TransactionUpdateModalComponent from "@/components/managements/histories/transaction/transaction_update_modal";
import TransactionItemMapService from "@/services/transaction_item_map_service";
import TransactionItemMap from "@/models/entities/transaction_item_map";

export default function ItemTransactionHistory() {
    const itemService = new ItemService();
    const transactionService = new TransactionService();
    const transactionItemMapService = new TransactionItemMapService();
    const pageState: PageState = useSelector((state: any) => state.page);
    const { transactions, currentModal } = pageState.transactionManagement
    const dispatch = useDispatch();

    const getAllItems = () => {
        itemService
            .readAll()
            .then((result: AxiosResponse<Content<Item[]>>) => {
                const content = result.data;
                dispatch(pageSlice.actions.configureItemManagement({
                    ...pageState.itemManagement,
                    items: content.data
                }))
            })
            .catch((error) => {
                console.log(error)
            });
    }

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
                  transactionItems: transactionItems.data
                })) 
            })
            .catch((error) => {
                console.log(error)
            });
    }

    useEffect(() => {
        getAllTransactions()
        if (pageState.itemManagement.items?.length == 0) getAllItems()
    }, [])

    const handleModalInsert = () => {
      dispatch(pageSlice.actions.configureTransactionManagement({
        ...pageState.transactionManagement,
        currentModal: "insertModal",
        isShowModal: true
      }))
    }

    const handleModalView = (transaction: Transaction) => {
      dispatch(pageSlice.actions.configureTransactionManagement({
        ...pageState.transactionManagement,
        transaction: transaction,
        currentModal: "viewModal",
        isShowModal: true
      }))
    }

    const convertDate = (dateTime: string) => {
        const date = new Date(dateTime).toDateString()
        const time = new Date(dateTime).toLocaleTimeString()
        return date + " " + time
    }

    return (
        <Authenticated>
            <div className="page item-transaction-history">
                <MessageModal/>
                {currentModal == 'insertModal' && <TransactionInsertModalComponent/>}
                {currentModal == 'viewModal' && <TransactionViewModalComponent/>}
                {currentModal == 'updateModal' && <TransactionUpdateModalComponent/>}
                <div className="header">
                    <div className="left-section">
                        <div className="title">
                            <h1>Item Transaction History</h1>
                        </div>
                        <div className="description">
                            <div className="text">
                                You can manage all of your item transactions history in here (view,
                                insert, update, and delete item transaction).
                            </div>
                        </div>
                    </div>
                    <div className="right-section">
                        <div className="control">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => handleModalInsert()}
                            >
                                <Image src={ButtonPlusImage} alt="plus"/>
                                Insert
                            </button>
                        </div>
                    </div>
                </div>

                <div className="body">
                    {transactions && transactions.length <= 0 ? (
                        <div className="empty-data">
                            <div className="text">
                                Your product transactions is empty, try to insert one!
                            </div>
                        </div>
                    ) : null}
                    {transactions && transactions.map((val, idx) => (
                        <div key={val.id} className="card">
                            <div className="image">
                                <Image
                                    src={ProductCardImage}
                                    onError={(e) => {
                                        e.target.src = ProductCardImage;
                                    }}
                                    alt="product"
                                />
                            </div>
                            <div className="content">
                                <div className="left">
                                    <div className="id">
                                        <div className="text">Code: {val.id}</div>
                                    </div>
                                    <div className="date">
                                        <div className="text">{convertDate(val.timestamp)}</div>
                                    </div>
                                </div>
                                <div className="right">
                                    <div className="total">
                                        <div className="text">{"Rp." + val.sellPrice}</div>
                                    </div>
                                </div>
                                {/* <div className="name">
                                  <div className="text">Name: {val.product.name}</div>
                                </div>
                                <div className="quantity">
                                  <div className="text">Quantity: {val.quantity}</div>
                                </div> */}
                            </div>
                            <div className="control">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={() => handleModalView(val)}
                                >
                                    Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Authenticated>
    );
}
