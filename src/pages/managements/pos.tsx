import {useDispatch, useSelector} from "react-redux";
import AccountService from "@/services/account_service";
import CompanyService from "@/services/company_service";
import ItemService from "@/services/item_service";
import RoleService from "@/services/role_service";
import LocationService from "@/services/location_service";
import {AuthenticationState} from "@/slices/authentication_slice";
import pageSlice, {PageState} from "@/slices/page_slice";
import React, {useEffect, useState} from "react";
import Authenticated from "@/layouts/authenticated";
import MessageModal from "@/components/message_modal";
import CheckoutModalComponent from "@/components/managements/pos/checkout_modal";
import Image from "next/image";
import PlusIcon from "@/assets/icons/plus.svg";
import MinusIcon from "@/assets/icons/minus.svg";
import ItemCardImage from "@/assets/images/item_management_card.svg";
import "@/styles/pages/managements/pos.scss"
import Item from "@/models/entities/item";
import Content from "@/models/value_objects/contracts/content";
import {Field, Form, Formik, useFormikContext} from "formik";


const AutoSearchFormikMiddleware = () => {
    const formik = useFormikContext();
    const [initialValueSearch, setInitialValueSearch] = useState({searchValue: ""})

    useEffect(() => {
        if (formik.values !== initialValueSearch) {
            formik.submitForm()
        }
    }, [formik.values])

    return null;
}
export default function PointOfSale() {
    const dispatch = useDispatch();
    const accountService: AccountService = new AccountService();
    const companyService: CompanyService = new CompanyService();
    const itemService: ItemService = new ItemService();
    const roleService: RoleService = new RoleService();
    const locationService: LocationService = new LocationService();
    const authenticationState: AuthenticationState = useSelector((state: any) => state.authentication);
    const {currentAccount} = authenticationState
    const pageState: PageState = useSelector((state: any) => state.page);
    const {currentModal, items, transactionItemMaps} = pageState.pointOfSaleManagement;


    useEffect(() => {
        fetchItems()
    }, [])

    const fetchItems = () => {
        itemService.readAllByLocationId({
            locationId: currentAccount?.locationId
        }).then((response) => {
            const content: Content<Item[]> = response.data;
            dispatch(pageSlice.actions.configurePointOfSaleManagement({
                ...pageState.pointOfSaleManagement,
                items: content.data,
            }))
        }).catch((error) => {
            console.log(error);
        })
    }

    const handleClickAdd = (item: any) => {

    }

    const handleSubmitSearch = (values: any) => {
        itemService.readAllByLocationId({
            locationId: currentAccount?.locationId
        }).then((response) => {
            const content: Content<Item[]> = response.data;
            dispatch(pageSlice.actions.configurePointOfSaleManagement({
                ...pageState.pointOfSaleManagement,
                items: content.data.filter((value) => {
                    return JSON.stringify(value).toLowerCase().includes(values.searchValue.toLowerCase())
                }),
            }))
        }).catch((error) => {
            console.log(error);
        })
    }

    return (
        <Authenticated>
            <div className="page pos-management">
                <MessageModal/>
                {currentModal == 'checkoutModal' && <CheckoutModalComponent/>}
                <div className="left-section">
                    <div className="top-section">
                        <div className="left-section">
                            <h1 className="title">
                                Point of Sale
                            </h1>
                            <div className="description">
                                You can manage all of your items in here (order, checkout).
                            </div>
                        </div>
                        <div className="right-section">
                            <Formik
                                initialValues={{searchValue: ""}}
                                onSubmit={handleSubmitSearch}
                            >
                                {(props) => (
                                    <Form>
                                        <fieldset className="form-group pb-2">
                                            <Field type="text" name="searchValue" className="form-control"
                                                   placeholder="Search in here..."/>
                                        </fieldset>
                                        <AutoSearchFormikMiddleware/>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                    <div className="bottom-section">
                        {items?.length == 0 ? (
                            <div className="empty-data">
                                <div className="text">
                                    Your items is empty, try to insert one or search again!
                                </div>
                            </div>
                        ) : undefined}
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
                                            onClick={() => handleClickAdd(value)}
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="right-section">
                    <div className="title">
                        <h1>The Order</h1>
                    </div>
                    <div>
                        <div className="order">
                            {
                                transactionItemMaps?.map((value, index) => (
                                    <div key={index} className="item">
                                        <div className="left-section">
                                            <div className="name">
                                                {(items || []).find(item => item.id == value.itemId)?.name}
                                            </div>
                                            <div className="price">
                                                {(items || []).find(item => item.id == value.itemId)?.unitSellPrice}
                                            </div>
                                        </div>
                                        <div className="right-section">
                                            <button className="button decrement">
                                                <Image src={MinusIcon} alt="minus" className="image"/>
                                            </button>
                                            <div className="text quantity">
                                                {value.quantity}
                                            </div>
                                            <button className="button increment">
                                                <Image src={PlusIcon} alt="plus" className="image"/>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    )
}