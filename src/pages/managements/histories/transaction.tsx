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
import messageModalSlice from "@/slices/message_modal_slice";
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
    const [modal, setModal] = useState("")
    const [transaction, setTransaction] = useState({})
    const [transactionHistory, setTransactionHistory] = useState([] as object[])
    const [transactionItems, setTransactionItems] = React.useState([] as object[])
    const pageState: PageState = useSelector((state: any) => state.page);
    const dispatch = useDispatch();

    const getAllItems = () => {
        const itemService = new ItemService();
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
                dispatch(messageModalSlice.actions.configure({
                    type: "failed",
                    content: error.message,
                    isShow: true
                }))
            });
    }

    const getAllTransaction = () => {
        const transactionService = new TransactionService();
        transactionService
            .readAll()
            .then((result: AxiosResponse<Content<Transaction[]>>) => {
                const {data} = result.data;
                setTransactionHistory(data)
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

    const getAllTransactionItems = () => {
        const transactionItemMapService = new TransactionItemMapService();
        transactionItemMapService
            .readAll()
            .then((result: AxiosResponse<Content<TransactionItemMap[]>>) => {
                const {data} = result.data;
                setTransactionItems(data)
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

    useEffect(() => {
        getAllTransaction()
        getAllTransactionItems()
        if (pageState.itemManagement.items?.length == 0) getAllItems()
    }, [])

    const handleModalInsert = () => {
        setModal("insertModal")
    }

    const handleModalView = (transaction: Transaction) => {
        setTransaction(transaction)
        setModal("viewModal")
    }

    const convertDate = (dateTime) => {
        const date = new Date(dateTime).toDateString()
        const time = new Date(dateTime).toLocaleTimeString()
        return date + " " + time
    }

    const transactionController = {
        transaction,
        setTransaction,
        transactionItems,
        getAllTransaction,
        getAllTransactionItems
    }

    return (
        <Authenticated>
            <div className="page item-transaction-history">
                <MessageModal/>
                {modal == 'insertModal' &&
                    <TransactionInsertModalComponent setModal={setModal} getAllTransaction={getAllTransaction}
                                                     getAllTransactionItems={getAllTransactionItems}/>}
                {modal == 'viewModal' &&
                    <TransactionViewModalComponent setModal={setModal} transactionController={transactionController}/>}
                {modal == 'updateModal' && <TransactionUpdateModalComponent setModal={setModal}
                                                                            transactionController={transactionController}/>}
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
                                Insert Transaction
                            </button>
                        </div>
                    </div>
                </div>

                <div className="body">
                    {transactionHistory.length <= 0 ? (
                        <div className="empty-data">
                            <div className="text">
                                Your product transactions is empty, try to insert one!
                            </div>
                        </div>
                    ) : null}
                    {transactionHistory.map((val, idx) => (
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
