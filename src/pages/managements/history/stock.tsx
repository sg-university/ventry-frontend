import React, { useState, useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";

import Image from "next/image";
import {AxiosResponse} from "axios";
import pageSlice, {PageState} from "@/slices/page_slice";
import InventoryControlService from "@/services/inventory_control_service";
import InventoryControl from "@/models/entities/inventory_control";
import Content from "@/models/value_objects/contracts/content";
import MessageModal from "@/components/message_modal";
import messageModalSlice, {MessageModalState} from "@/slices/message_modal_slice";
import Authenticated from "@/layouts/authenticated";
import ButtonPlusImage from "@/assets/images/control_button_plus.svg";
import ItemCardImage from "@/assets/images/item_management_card.svg";
import "@/styles/pages/managements/history/stock.scss"
import ItemService from "@/services/item_service";
import Item from "@/models/entities/item";
import InventoryControlViewModalComponent from "@/components/inventory_control_history/inventory_control_view_modal";
import InventoryControlUpdateModalComponent from "@/components/inventory_control_history/inventory_control_update_modal";
import InventoryControlInsertModalComponent from "@/components/inventory_control_history/inventory_control_insert_modal";

export default function ItemTransactionHistory() {
  const [ inventoryControlHistory, setInventoryControlHistory ] = useState([] as object[])
  const [modal, setModal] = useState("")
  const [inventoryControl, setInventoryControl] = useState({})
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
          const messageModalState: MessageModalState = {
              title: "Status",
              type: "failed",
              content: error.message,
              isShow: true
          }
          dispatch(messageModalSlice.actions.configure(messageModalState))
      });
  }

  const getAllInventoryControl = () => {
    const inventoryControlService = new InventoryControlService();
      inventoryControlService
        .readAll()
        .then((result: AxiosResponse<Content<InventoryControl[]>>) => {
              const { data } = result.data;
              setInventoryControlHistory(data)
          })
          .catch((error) => {
              console.log(error)
              const messageModalState: MessageModalState = {
                  title: "Status",
                  type: "failed",
                  content: error.message,
                  isShow: true
              }
              dispatch(messageModalSlice.actions.configure(messageModalState))
          });
  }

  useEffect(() => {
    getAllInventoryControl()
    if(pageState.itemManagement.items.length == 0) getAllItems()
  }, [])

  const handleModalInsert = () => {
    setModal("insertModal")
  }

  const handleModalView = (inventoryControl: InventoryControl) => {
    setInventoryControl(inventoryControl)
    setModal("viewModal")
  }

  const convertDate = (dateTime) => {
    const date = new Date(dateTime).toDateString() 
    const time = new Date(dateTime).toLocaleTimeString()
    return date+" "+time
  }

  const calculateQuantity = (before, after) =>  {
    return after-before
  }

  const inventoryControlController = {
    inventoryControl,
    setInventoryControl,
    convertDate,
    setModal,
    getAllInventoryControl
  }

  return (
    <Authenticated>
      <div className="page inventory-control-history">
        <MessageModal/>
        {modal == 'insertModal' && <InventoryControlInsertModalComponent setModal={setModal} getAllInventoryControl={getAllInventoryControl}/>}
        {modal == 'viewModal' && <InventoryControlViewModalComponent setModal={setModal} inventoryControlController={inventoryControlController} getAllInventoryControl={getAllInventoryControl}/>}
        {modal == 'updateModal' && <InventoryControlUpdateModalComponent setModal={setModal} inventoryControl={inventoryControl} setInventoryControl={setInventoryControl} getAllInventoryControl={getAllInventoryControl}/>}
        <div className="header">
          <div className="left-section">
            <div className="title">
              <h1>Inventory Control History</h1>
            </div>
            <div className="description">
              <div className="text">
                You can manage all of your inventory controls in here (view,
                insert, update, and delete inventory control).
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
                <Image src={ButtonPlusImage} alt="plus" />
                Insert History
              </button>
            </div>
          </div>
        </div>

        <div className="body">
          {inventoryControlHistory.length <= 0 ? (
            <div className="empty-data">
              <div className="text">
                Your inventory controls is empty, try to insert one!
              </div>
            </div>
          ) : null}
          {inventoryControlHistory.map((val, idx) => (
            <div key={val.id} className="card">
              <div className="image">
                <Image
                  src={ItemCardImage}
                  onError={(e) => {
                    e.target.src = ItemCardImage;
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
                    <div className="text">{calculateQuantity(val.quantityBefore, val.quantityAfter)}</div>
                  </div>
                </div>
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
