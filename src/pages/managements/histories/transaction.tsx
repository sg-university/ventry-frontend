import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";

import Image from "next/image";
import pageSlice, {PageState} from "@/slices/page_slice";
import TransactionService from "@/services/transaction_service";
import Transaction from "@/models/entities/transaction";
import ItemService from "@/services/item_service";
import MessageModal from "@/components/message_modal";
import Authenticated from "@/layouts/authenticated";
import ButtonPlusImage from "@/assets/images/control_button_plus.svg";
import ProductCardImage from "@/assets/images/product_management_card.svg";
import TransactionInsertModalComponent from "@/components/managements/histories/transaction/transaction_insert_modal";
import TransactionViewModalComponent from "@/components/managements/histories/transaction/transaction_view_modal";
import "@/styles/pages/managements/histories/transaction.scss"
import TransactionUpdateModalComponent from "@/components/managements/histories/transaction/transaction_update_modal";
import TransactionItemMapService from "@/services/transaction_item_map_service";
import {AuthenticationState} from "@/slices/authentication_slice";
import Content from "@/models/value_objects/contracts/content";
import Item from "@/models/entities/item";
import TransactionItemMap from "@/models/entities/transaction_item_map";

export default function ItemTransactionHistory() {
    const itemService = new ItemService();
    const transactionService = new TransactionService();
    const transactionItemMapService = new TransactionItemMapService();
    const pageState: PageState = useSelector((state: any) => state.page);
    const {transactions, currentModal, transactionItemMaps} = pageState.transactionHistoryManagement
    const authenticationState: AuthenticationState = useSelector((state: any) => state.authentication);
    const {currentAccount} = authenticationState;
    const dispatch = useDispatch();

    const fetchAllItemsAndTransactions = () => {
        Promise.all([
            itemService
                .readAllByLocationId({
                    locationId: currentAccount?.locationId
                }),
            transactionService
                .readAllByLocationId({
                    locationId: currentAccount?.locationId
                }),
            transactionItemMapService
                .readAllByLocationId({
                    locationId: currentAccount?.locationId
                })
        ]).then((response) => {
            const itemsContent: Content<Item[]> = response[0].data
            const transactionsContent: Content<Transaction[]> = response[1].data
            const transactionItemMapsContent: Content<TransactionItemMap[]> = response[2].data

            dispatch(pageSlice.actions.configureTransactionHistoryManagement({
                ...pageState.transactionHistoryManagement,
                items: itemsContent.data.sort((a, b) => {
                    return new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime()
                }),
                transactions: transactionsContent.data.sort((a, b) => {
                    return new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime()
                }),
                transactionItemMaps: transactionItemMapsContent.data.sort((a, b) => {
                    return new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime()
                })
            }))
        }).catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        fetchAllItemsAndTransactions()
    }, [])

    const handleModalInsert = () => {
        dispatch(pageSlice.actions.configureTransactionHistoryManagement({
            ...pageState.transactionHistoryManagement,
            currentModal: "insertModal",
            currentTransaction: undefined,
            currentTransactionItemMaps: [],
            isShowModal: true
        }))
    }

    const handleModalView = (transaction: Transaction) => {
        dispatch(pageSlice.actions.configureTransactionHistoryManagement({
            ...pageState.transactionHistoryManagement,
            currentTransaction: transaction,
            currentTransactionItemMaps: transactionItemMaps!.filter((tim) => tim.transactionId === transaction.id),
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
                    {transactions!.length <= 0 ? (
                        <div className="empty-data">
                            <div className="text">
                                Your transactions history is empty, try to insert one!
                            </div>
                        </div>
                    ) : null}
                    {transactions!.map((value, index) => (
                        <div key={value.id} className="card">
                            <div className="image">
                                <Image
                                    src={ProductCardImage}
                                    alt="product"
                                />
                            </div>
                            <div className="content">
                                <div className="left">
                                    <div className="id">
                                        <div className="text">ID: {value.id}</div>
                                    </div>
                                    <div className="date">
                                        <div className="text">{convertDate(value.timestamp)}</div>
                                    </div>
                                </div>
                                <div className="right">
                                    <div className="total">
                                        <div className="text">{"Rp. " + value.sellPrice}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="control">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={() => handleModalView(value)}
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
