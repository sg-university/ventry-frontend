import MessageModal from "@/components/message_modal";

import ButtonPlusImage from "@/assets/images/control_button_plus.svg";
import ItemCardImage from "@/assets/images/item_management_card.svg";
import Image from "next/image";
import {useDispatch, useSelector} from "react-redux";
import pageSlice, {PageState} from "@/slices/page_slice";
import {useEffect} from "react";
import ItemService from "@/services/item_service";
import {AxiosResponse} from "axios";
import Content from "@/models/value_objects/contracts/content";
import messageModalSlice, {MessageModalState} from "@/slices/message_modal_slice";
import Item from "@/models/entities/item";
import "@/styles/pages/managements/items.scss"
import Authenticated from "@/layouts/authenticated";

export default function Items() {

    const pageState: PageState = useSelector((state: any) => state.page);

    const dispatch = useDispatch();

    useEffect(() => {
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
    }, [])

    const handleModalInsert = () => {
    }

    const handleModalView = (item: Item) => {
    }

    return (
        <Authenticated>
            <div className="page item-management">
                <MessageModal/>
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
                                onClick={() => handleModalInsert()}
                            >
                                <Image src={ButtonPlusImage} alt="plus"/>
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

