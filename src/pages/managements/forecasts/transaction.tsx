import {useDispatch, useSelector} from "react-redux";
import AccountService from "@/services/account_service";
import CompanyService from "@/services/company_service";
import ItemService from "@/services/item_service";
import RoleService from "@/services/role_service";
import LocationService from "@/services/location_service";
import {AuthenticationState} from "@/slices/authentication_slice";
import pageSlice, {PageState} from "@/slices/page_slice";
import React, {useEffect} from "react";
import Content from "@/models/value_objects/contracts/content";
import Item from "@/models/entities/item";
import Authenticated from "@/layouts/authenticated";
import MessageModal from "@/components/message_modal";
import ButtonPlusImage from "@/assets/images/control_button_plus.svg";
import ItemCardImage from "@/assets/images/item_management_card.svg";
import "@/styles/pages/managements/forecasts/transaction.scss"
import Image from "next/image";
import TransactionViewModalComponent from "@/components/managements/forecasts/transaction_view_modal";
import ImageUtility from "@/utilities/image_utility";

export default function Transaction() {
    const dispatch = useDispatch();
    const imageUtility: ImageUtility = new ImageUtility()
    const accountService: AccountService = new AccountService();
    const companyService: CompanyService = new CompanyService();
    const itemService: ItemService = new ItemService();
    const roleService: RoleService = new RoleService();
    const locationService: LocationService = new LocationService();
    const authenticationState: AuthenticationState = useSelector((state: any) => state.authentication);
    const pageState: PageState = useSelector((state: any) => state.page);
    const {currentModal, items} = pageState.itemTransactionForecastManagement;

    useEffect(() => {
        fetchLocationTransaction()
    }, [])

    const fetchLocationTransaction = () => {
        itemService.readAllByLocationId({
            locationId: authenticationState.currentAccount?.locationId
        }).then((response) => {
            const content: Content<Item[]> = response.data;
            dispatch(pageSlice.actions.configureItemTransactionForecastManagement({
                ...pageState.itemTransactionForecastManagement,
                items: content.data.sort((a, b) => {
                    return new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime()
                }),
            }))
        }).catch((error) => {
            console.log(error);
        })
    }

    const handleClickButtonDetails = (item: Item) => {
        dispatch(pageSlice.actions.configureItemTransactionForecastManagement({
            ...pageState.itemTransactionForecastManagement,
            currentItem: item,
            currentModal: "viewModal",
            isShowModal: true
        }))
    }


    return (
        <Authenticated>
            <div className="page transaction-forecast">
                <MessageModal/>
                {currentModal == "viewModal" && <TransactionViewModalComponent/>}
                <div className="header">
                    <div className="left-section">
                        <div className="title">
                            <h1>Transaction Forecast</h1>
                        </div>
                        <div className="description">
                            <div className="text">
                                You can see a forecasting graph detail of your item transaction here.
                            </div>
                        </div>
                    </div>
                    <div className="right-section d-none">
                        <div className="control">
                            <button type="button" className="btn btn-primary">
                                <Image src={ButtonPlusImage} alt="plus"/>
                                Action
                            </button>
                        </div>
                    </div>
                </div>

                <div className="body">
                    {items?.length == 0 ? (
                        <div className="empty-data">
                            <div className="text">
                                Your items is empty, try to insert one!
                            </div>
                        </div>
                    ) : undefined}
                    {items && items.map((value, index) => (
                        <div key={value.id} className="card">
                            <div className="image">
                                <Image
                                    src={value.image ? imageUtility.blobToBase64AsData(value.image) : ItemCardImage}
                                    width={298}
                                    height={160}
                                    alt="item"
                                    className={"rounded-1"}
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
                                        onClick={() => handleClickButtonDetails(value)}
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
    )
}