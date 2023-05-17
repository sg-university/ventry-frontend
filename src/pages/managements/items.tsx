import MessageModal from "@/components/message_modal";

import ButtonPlusImage from "@/assets/images/control_button_plus.svg";
import ItemCardImage from "@/assets/images/item_management_card.svg";
import Image from "next/image";
import {useDispatch, useSelector} from "react-redux";
import pageSlice, {PageState} from "@/slices/page_slice";
import {useEffect} from "react";
import ItemService from "@/services/item_service";
import Content from "@/models/value_objects/contracts/content";
import Item from "@/models/entities/item";
import Authenticated from "@/layouts/authenticated";
import ItemInsertModalComponent from "@/components/managements/items/item_insert_modal";
import ItemViewModalComponent from "@/components/managements/items/item_view_modal";
import ItemUpdateModalComponent from "@/components/managements/items/item_update_modal";
import "@/styles/pages/managements/items.scss"
import LocationService from "@/services/location_service";
import AccountService from "@/services/account_service";
import CompanyService from "@/services/company_service";
import RoleService from "@/services/role_service";
import {AuthenticationState} from "@/slices/authentication_slice";

export default function Items() {
    const dispatch = useDispatch();
    const accountService: AccountService = new AccountService();
    const companyService: CompanyService = new CompanyService();
    const itemService: ItemService = new ItemService();
    const roleService: RoleService = new RoleService();
    const locationService: LocationService = new LocationService();
    const authenticationState: AuthenticationState = useSelector((state: any) => state.authentication);
    const {currentAccount} = authenticationState
    const pageState: PageState = useSelector((state: any) => state.page);
    const {currentModal, items} = pageState.itemManagement;

    useEffect(() => {
        fetchItemsByAccountLocation()
    }, [])

    const fetchItemsByAccountLocation = () => {
        itemService.readAllByLocationId({
            locationId: currentAccount?.locationId
        }).then((response) => {
            const content: Content<Item[]> = response.data;
            dispatch(pageSlice.actions.configureItemManagement({
                ...pageState.itemManagement,
                items: content.data,
            }))
        }).catch((error) => {
            console.log(error);
        })
    }

    const handleInsertModal = () => {
        dispatch(pageSlice.actions.configureItemManagement({
            ...pageState.itemManagement,
            currentModal: "insertModal",
            isShowModal: true,
            currentModalMenu: "main"
        }))
    }

    const handleViewModal = (item: Item) => {
        dispatch(pageSlice.actions.configureItemManagement({
            ...pageState.itemManagement,
            currentItem: item,
            currentModal: "viewModal",
            currentModalMenu: "main",
            isShowModal: true
        }))
    }


    return (
        <Authenticated>
            <div className="page item-management">
                <MessageModal/>
                {currentModal == 'insertModal' && <ItemInsertModalComponent/>}
                {currentModal == 'viewModal' && <ItemViewModalComponent/>}
                {currentModal == 'updateModal' && <ItemUpdateModalComponent/>}
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
                                onClick={() => handleInsertModal()}
                            >
                                <Image src={ButtonPlusImage} alt="plus" className="image"/>
                                Insert Item
                            </button>
                        </div>
                    </div>
                </div>

                <div className="body">
                    {items ? undefined : (
                        <div className="empty-data">
                            <div className="text">
                                Your items is empty, try to insert one!
                            </div>
                        </div>
                    )}
                    {items && items.map((value, idx) => (
                        <div key={value.id} className="card">
                            <div className="image">
                                <Image
                                    src={ItemCardImage}
                                    alt="item"
                                />
                            </div>
                            <div className="content">
                                <div className="code">
                                    <div className="text">Code: {value.code}</div>
                                </div>
                                <div className="name">
                                    <div className="text">Name: {value.name}</div>
                                </div>
                                <div className="quantity">
                                    <div className="text">Quantity: {value.quantity}</div>
                                </div>
                                <div className="control">
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        onClick={() => handleViewModal(value)}
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

