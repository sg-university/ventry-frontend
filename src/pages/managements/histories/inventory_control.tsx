import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";

import Image from "next/image";
import pageSlice, {PageState} from "@/slices/page_slice";
import InventoryControlService from "@/services/inventory_control_service";
import InventoryControl from "@/models/entities/inventory_control";
import Content from "@/models/value_objects/contracts/content";
import MessageModal from "@/components/message_modal";
import Authenticated from "@/layouts/authenticated";
import ButtonPlusImage from "@/assets/images/control_button_plus.svg";
import ItemCardImage from "@/assets/images/item_management_card.svg";
import "@/styles/pages/managements/histories/stock.scss"
import ItemService from "@/services/item_service";
import Item from "@/models/entities/item";
import InventoryControlViewModalComponent
    from "@/components/managements/histories/inventory_control/inventory_control_view_modal";
import InventoryControlUpdateModalComponent
    from "@/components/managements/histories/inventory_control/inventory_control_update_modal";
import InventoryControlInsertModalComponent
    from "@/components/managements/histories/inventory_control/inventory_control_insert_modal";
import {AuthenticationState} from "@/slices/authentication_slice";

export default function ItemTransactionHistory() {
    const itemService = new ItemService();
    const inventoryControlService = new InventoryControlService();
    const pageState: PageState = useSelector((state: any) => state.page);
    const authenticationState: AuthenticationState = useSelector((state: any) => state.authentication);
    const {currentAccount} = authenticationState;
    const {
        accountItems,
        accountInventoryControls,
        currentModal,
        isShowModal
    } = pageState.inventoryControlHistoryManagement
    const dispatch = useDispatch();

    const fetchAccountItemsAndInventoryControls = () => {
        Promise.all([
            itemService
                .readAllByAccountId({
                    accountId: currentAccount?.id
                }),
            inventoryControlService.readAll()
        ])
            .then((response) => {
                const itemsContent: Content<Item[]> = response[0].data;
                const inventoryControlsContent: Content<InventoryControl[]> = response[1].data;
                dispatch(pageSlice.actions.configureInventoryControlHistoryManagement({
                    ...pageState.itemManagement,
                    accountItems: itemsContent.data,
                    accountInventoryControls: inventoryControlsContent.data.filter((item) => item.accountId === currentAccount?.id)
                }))
            })
            .catch((error) => {
                console.log(error)
            });
    }

    useEffect(() => {
        fetchAccountItemsAndInventoryControls()
    }, [])

    const handleModalInsert = () => {
        dispatch(pageSlice.actions.configureInventoryControlHistoryManagement({
            ...pageState.inventoryControlHistoryManagement,
            currentModal: "insertModal",
            isShowModal: true
        }))
    }

    const handleModalView = (inventoryControl: InventoryControl) => {
        dispatch(pageSlice.actions.configureInventoryControlHistoryManagement({
            ...pageState.inventoryControlHistoryManagement,
            currentItem: (accountItems || []).find((item) => item.id === inventoryControl.itemId),
            currentInventoryControl: inventoryControl,
            currentModal: "viewModal",
            isShowModal: !isShowModal
        }))
    }

    const convertDate = (dateTime: string) => {
        const date = new Date(dateTime).toDateString()
        const time = new Date(dateTime).toLocaleTimeString()
        return date + " " + time
    }

    const calculateQuantity = (before: number, after: number) => {
        return after - before
    }

    return (
        <Authenticated>
            <div className="page inventory-control-history">
                <MessageModal/>
                {currentModal == 'insertModal' && <InventoryControlInsertModalComponent/>}
                {currentModal == 'viewModal' && <InventoryControlViewModalComponent/>}
                {currentModal == 'updateModal' && <InventoryControlUpdateModalComponent/>}
                <div className="header">
                    <div className="left-section">
                        <div className="title">
                            <h1>Inventory Control History</h1>
                        </div>
                        <div className="description">
                            <div className="text">
                                You can manage all of your inventory controls in here (view,
                                insert, update, and delete).
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
                    {(accountInventoryControls || [])?.length <= 0 ? (
                        <div className="empty-data">
                            <div className="text">
                                Your inventory controls is empty, try to insert one!
                            </div>
                        </div>
                    ) : null}
                    {accountInventoryControls?.map((value, index) => (
                        <div key={value.id} className="card">
                            <div className="image">
                                <Image
                                    src={ItemCardImage}
                                    alt="product"
                                />
                            </div>
                            <div className="content">
                                <div className="left">
                                    <div className="id">
                                        <div className="text">Code: {value.id}</div>
                                    </div>
                                    <div className="date">
                                        <div className="text">{convertDate(value.timestamp)}</div>
                                    </div>
                                </div>
                                <div className="right">
                                    <div className="total">
                                        <div className="text">
                                            {calculateQuantity(value.quantityBefore, value.quantityAfter)}
                                        </div>
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
