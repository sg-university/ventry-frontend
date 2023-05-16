import React, {useEffect, useState} from "react";
import {Modal} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";

import {PageState} from "@/slices/page_slice";
import "@/styles/components/managements/histories/inventory_controls/inventory_control_view_modal.scss";
import InventoryControlService from "@/services/inventory_control_service";
import DeleteOneByIdRequest
    from "@/models/value_objects/contracts/requests/managements/inventory_controls/delete_one_by_id_request";
import messageModalSlice from "@/slices/message_modal_slice";
import Content from "@/models/value_objects/contracts/content";
import InventoryControl from "@/models/entities/inventory_control";

function MainComponent(props) {
    const [item, setItem] = useState({})
    const {inventoryControl, convertDate} = props.inventoryControlController

    const pageState: PageState = useSelector((state: any) => state.page);
    const items = pageState.itemManagement.items
    const itemData = items.filter((item) => item.id === inventoryControl.itemId)

    useEffect(() => {
        setItem(itemData[0])
    }, [])

    return (
        <div className="main">
            <div className="id">
                <div className="text">{`ID: ${inventoryControl.id}`}</div>
            </div>
            <div className="code">
                <div className="text">{`Code: ${item.code}`}</div>
            </div>
            <div className="name">
                <div className="text">{`Name: ${item.name}`}</div>
            </div>
            <div className="price">
                <div className="text">{`Price: ${item.unitSellPrice}`}</div>
            </div>
            <div className="quantity-before">
                <div className="text">{`Quantity before: ${inventoryControl.quantityBefore}`}</div>
            </div>
            <div className="quantity-after">
                <div className="text">{`Quantity After: ${inventoryControl.quantityAfter}`}</div>
            </div>
            <div className="updated-at">
                <div className="text">{`Updated At: ${convertDate(inventoryControl.updatedAt)}`}</div>
            </div>
            <div className="created-at">
                <div className="text">{`Created At: ${convertDate(inventoryControl.createdAt)}`}</div>
            </div>
        </div>
    );
}

export default function InventoryControlViewModalComponent(props) {
    const [isShow, setIsShow] = React.useState(true)
    const [menu, setMenu] = React.useState('main')
    const {inventoryControl, setModal, getAllInventoryControl} = props.inventoryControlController
    const dispatch = useDispatch();

    const handleShow = () => {
        setIsShow(!isShow)
        props.setModal("")
    };

    const handleModalUpdate = () => {
        setModal("updateModal")
    }

    const handleModalDelete = () => {
        const inventoryControlService = new InventoryControlService()
        const request: DeleteOneByIdRequest = {
            id: inventoryControl.id
        }
        inventoryControlService
            .deleteOneById(request)
            .then((response) => {
                const content: Content<InventoryControl> = response.data;
                handleShow()
                dispatch(messageModalSlice.actions.configure({
                    type: "succeed",
                    content: content.message,
                    isShow: true
                }))
                getAllInventoryControl()
            })
    }


    return (
        <Modal
            show={isShow}
            onHide={handleShow}
            centered
            className="component item-view-modal"
        >
            <Modal.Header closeButton className="header">
                <Modal.Title>Inventory Control Details</Modal.Title>
            </Modal.Header>

            <Modal.Body className="body">
                {
                    // Menu switch.
                    {
                        main: (
                            <MainComponent
                                inventoryControlController={props.inventoryControlController}
                            />
                        ),
                    }[menu]
                }
            </Modal.Body>

            <Modal.Footer className="footer">
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleModalUpdate()}
                >
                    Update Control
                </button>
                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleModalDelete()}
                >
                    Delete Control
                </button>
            </Modal.Footer>
        </Modal>
    );
}
