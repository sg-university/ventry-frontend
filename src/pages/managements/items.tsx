import MessageModal from "@/components/message_modal";

import ButtonPlusImage from "@/assets/images/control_button_plus.svg";
import ItemCardImage from "@/assets/images/item_management_card.svg";
import Image from "next/image";
import {useDispatch, useSelector} from "react-redux";
import pageSlice, {PageState} from "@/slices/page_slice";
import { useState, useEffect } from "react";
import ItemService from "@/services/item_service";
import {AxiosResponse} from "axios";
import Content from "@/models/value_objects/contracts/content";
import messageModalSlice, {MessageModalState} from "@/slices/message_modal_slice";
import Item from "@/models/entities/item";
import Authenticated from "@/layouts/authenticated";
import ItemInsertModalComponent from "@/components/item_management/item_insert_modal";
import ItemViewModalComponent from "@/components/item_management/item_view_modal";
import { ItemUpdateModalComponent } from "@/components/item_management/item_update_modal";
import "@/styles/pages/managements/items.scss"
import LocationService from "@/services/location_service";
import Location from "@/models/entities/location";

export default function Items() {
    const [modal, setModal] = useState("")
    const [item, setItem] = useState({})
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
                  content: error.message,
                  isShow: true
              }
              dispatch(messageModalSlice.actions.configure(messageModalState))
          });
    }

    const getAllLocations = () => {
      const locationService = new LocationService()
      locationService
        .readAll()
        .then((result: AxiosResponse<Content<Location[]>>) => {
          const content = result.data;
          dispatch(pageSlice.actions.configureLocationManagement({
              ...pageState.locationManagement,
              locations: content.data
          }))
        })
        .catch((error) => {
            console.log(error)
            const messageModalState: MessageModalState = {
                title: "Status",
                content: error.message,
                isShow: true
            }
            dispatch(messageModalSlice.actions.configure(messageModalState))
        });
    }

    useEffect(() => {
      getAllItems(),
      getAllLocations()
    }, [])

    const handleModalInsert = () => {
      setModal("insertModal")
    }

    const handleModalView = (item: Item) => {
      setItem(item)
      setModal("viewModal")
    }

    const itemControllers = {
      item,
      setItem,
      getAllItems
    }

    return (
        <Authenticated>
            <div className="page item-management">
                <MessageModal/>
                {modal == 'insertModal' && <ItemInsertModalComponent setModal={setModal} getAllItems={getAllItems}/>}
                {modal == 'viewModal' && <ItemViewModalComponent setModal={setModal} item={item} getAllItems={getAllItems}/>}
                {modal == 'updateModal' && <ItemUpdateModalComponent setModal={setModal} itemControllers={itemControllers}/>}
                <div className="header">
                    <div className="left-section">
                        <div className="title">
                            <h1>Item Management</h1>
                        </div>
                        <div className="description">
                            <div className="text">
                                You can manage all of your items in here (view, insert, update,
                                and delete item).
                            </div>
                        </div>
                    </div>
                    <div className="right-section">
                        <div className="control">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleModalInsert}
                            >
                                <Image src={ButtonPlusImage} alt="plus" className="image"/>
                                Insert Item
                            </button>
                        </div>
                    </div>
                </div>

                <div className="body">
                    {pageState.itemManagement.items.length <= 0 ? (
                        <div className="empty-data">
                            <div className="text">
                                Your items is empty, try to insert one!
                            </div>
                        </div>
                    ) : null}
                    {pageState.itemManagement.items.map((val, idx) => (
                        <div key={val.id} className="card">
                            <div className="image">
                                <Image
                                    src={ItemCardImage}
                                    alt="item"
                                />
                            </div>
                            <div className="content">
                                <div className="code">
                                    <div className="text">Code: {val.code}</div>
                                </div>
                                <div className="name">
                                    <div className="text">Name: {val.name}</div>
                                </div>
                                <div className="quantity">
                                    <div className="text">Quantity: {val.quantity}</div>
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
                        </div>
                    ))}
                </div>
            </div>
        </Authenticated>
    );
}

