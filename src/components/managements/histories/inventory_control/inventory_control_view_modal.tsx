import React from "react";
import {Modal} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";


import pageSlice, {PageState} from "@/slices/page_slice";
import "@/styles/components/managements/histories/inventory_controls/inventory_control_view_modal.scss";
import InventoryControlService from "@/services/inventory_control_service";
import messageModalSlice from "@/slices/message_modal_slice";
import Content from "@/models/value_objects/contracts/content";
import InventoryControl from "@/models/entities/inventory_control";
import confirmationModalSlice from "@/slices/confirmation_modal_slice";


export default function InventoryControlViewModalComponent() {
    const inventoryControlService = new InventoryControlService()
    const pageState: PageState = useSelector((state: any) => state.page);
    const {
        isShowModal,
        currentInventoryControl,
        currentItem,
        accountInventoryControls
    } = pageState.inventoryControlHistoryManagement
    const dispatch = useDispatch();

    const handleShowModal = () => {
        dispatch(pageSlice.actions.configureInventoryControlHistoryManagement({
            ...pageState.inventoryControlHistoryManagement,
            isShowModal: !isShowModal,
        }))
    }

    const handleModalUpdate = () => {
        dispatch(pageSlice.actions.configureInventoryControlHistoryManagement({
            ...pageState.inventoryControlHistoryManagement,
            currentModal: "updateModal",
            isShowModal: true,
        }))
    }

    const handleModalDelete = () => {
        const callback = () => {
            inventoryControlService.deleteOneById({
                id: currentInventoryControl?.id
            }).then((response) => {
                const content: Content<InventoryControl> = response.data
                dispatch(messageModalSlice.actions.configure({
                    type: "succeed",
                    content: "Delete Inventory Control succeed.",
                    isShow: true
                }))
                dispatch(pageSlice.actions.configureInventoryControlHistoryManagement({
                    ...pageState.inventoryControlHistoryManagement,
                    isShowModal: !isShowModal,
                    accountInventoryControls: accountInventoryControls?.filter((item) => item.id !== currentInventoryControl?.id),
                }))
            }).catch((error) => {
                dispatch(messageModalSlice.actions.configure({
                    type: "failed",
                    content: error.message,
                    isShow: true
                }))
            })
        }

        dispatch(confirmationModalSlice.actions.configure({
            isShow: true,
            content: "Are you sure want to delete this Inventory Control?",
            callback: callback
        }))
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
            className="component item-view-modal"
        >
            <Modal.Header closeButton className="header">
                <Modal.Title>Inventory Control Details</Modal.Title>
            </Modal.Header>

            <Modal.Body className="body">
                <div className="main">
                    <div className="id">
                        <div className="text">{`ID: ${currentItem?.id}`}</div>
                    </div>
                    <div className="code">
                        <div className="text">{`Code: ${currentItem?.code}`}</div>
                    </div>
                    <div className="name">
                        <div className="text">{`Name: ${currentItem?.name}`}</div>
                    </div>
                    <div className="price">
                        <div className="text">{`Price: ${currentItem?.unitSellPrice}`}</div>
                    </div>
                    <div className="quantity-before">
                        <div className="text">{`Quantity before: ${currentInventoryControl?.quantityBefore}`}</div>
                    </div>
                    <div className="quantity-after">
                        <div className="text">{`Quantity After: ${currentInventoryControl?.quantityAfter}`}</div>
                    </div>
                    <div className="timestamp">
                        <div className="text">{`Timestamp: ${convertDate(currentInventoryControl?.timestamp!)}`}</div>
                    </div>
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
