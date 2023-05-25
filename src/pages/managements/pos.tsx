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
import TransactionItemMap from "@/models/entities/transaction_item_map";
import {PlusLg} from "react-bootstrap-icons";
import messageModalSlice from "@/slices/message_modal_slice";


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

    const totalPrice = transactionItemMaps?.reduce((previous, current) => {
        return previous + (items!.find(item => item.id == current.itemId)!.unitSellPrice! * current.quantity!)
    }, 0)

    useEffect(() => {
        prepareTransaction()
        fetchItems()
    }, [])

    const prepareTransaction = () => {
        dispatch(pageSlice.actions.configurePointOfSaleManagement({
            ...pageState.pointOfSaleManagement,
            currentTransaction: {
                id: undefined,
                accountId: currentAccount?.id,
                sellPrice: totalPrice,
                timestamp: undefined,
                createdAt: undefined,
                updatedAt: undefined,
            }
        }))
    }

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


    const handleClickAdd = (item: Item) => {
        if (item.quantity <= 0) {
            dispatch(messageModalSlice.actions.configure({
                type: "failed",
                content: `Item code "${item.code}" did not have enough available quantity.`,
                isShow: true
            }))
            return
        }


        dispatch(pageSlice.actions.configurePointOfSaleManagement({
            ...pageState.pointOfSaleManagement,
            transactionItemMaps: [
                ...transactionItemMaps!,
                {
                    id: undefined,
                    transactionId: undefined,
                    itemId: item.id,
                    sellPrice: item.unitSellPrice,
                    quantity: 1,
                    createdAt: undefined,
                    updatedAt: undefined,
                }
            ]
        }))
    }

    const handleClickRemove = (item: Item) => {
        dispatch(pageSlice.actions.configurePointOfSaleManagement({
            ...pageState.pointOfSaleManagement,
            transactionItemMaps: transactionItemMaps?.filter((value) => {
                return value.itemId != item.id
            })
        }))
    }


    const handleClickIncrement = (transactionItemMap: TransactionItemMap) => {
        const item = items!.find((item) => item.id === transactionItemMap.itemId)
        if (item!.id === transactionItemMap.itemId) {
            if (item!.quantity - (transactionItemMap.quantity! + 1) < 0) {
                dispatch(messageModalSlice.actions.configure({
                    type: "failed",
                    content: `Item code "${item!.code}" did not have enough available quantity.`,
                    isShow: true
                }))
                return
            }
        }

        dispatch(pageSlice.actions.configurePointOfSaleManagement({
            ...pageState.pointOfSaleManagement,
            transactionItemMaps: transactionItemMaps?.map((value) => {
                if (value.itemId == transactionItemMap.itemId) {
                    return {
                        ...value,
                        quantity: value.quantity! + 1
                    }
                }
                return value
            })
        }))
    }


    const handleClickDecrement = (transactionItemMap: TransactionItemMap) => {
        if (transactionItemMap.quantity! - 1 < 0) {
            dispatch(messageModalSlice.actions.configure({
                type: "failed",
                content: `Item code "${items!.find((item) => item.id === transactionItemMap.itemId)!.code}" must be greater than or equal to 0.`,
                isShow: true
            }))
            return true
        }

        dispatch(pageSlice.actions.configurePointOfSaleManagement({
            ...pageState.pointOfSaleManagement,
            transactionItemMaps: transactionItemMaps?.map((value) => {
                if (value.itemId == transactionItemMap.itemId) {
                    return {
                        ...value,
                        quantity: value.quantity! - 1
                    }
                }
                return value
            })
        }))
    }

    const handleClickCheckout = () => {
        if (transactionItemMaps == undefined || transactionItemMaps?.length == 0) {
            dispatch(messageModalSlice.actions.configure({
                type: "failed",
                isShow: true,
                content: "Please add an item to the order."
            }))
            return
        }

        if (totalPrice == 0) {
            dispatch(messageModalSlice.actions.configure({
                type: "failed",
                isShow: true,
                content: "Total price must be greater than 0."
            }))
            return
        }

        dispatch(pageSlice.actions.configurePointOfSaleManagement({
            ...pageState.pointOfSaleManagement,
            currentModal: 'checkoutModal',
            isShowModal: true,
            currentTransaction: {
                ...pageState.pointOfSaleManagement.currentTransaction,
                sellPrice: totalPrice,
            }
        }))
    }

    return (
        <Authenticated>
            <div className="page pos-management">
                <MessageModal/>
                {currentModal == "checkoutModal" && <CheckoutModalComponent/>}
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
                        {items && items.map((value, index) => (
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
                                    <div className="action">
                                        {
                                            transactionItemMaps?.find((item) => item.itemId == value.id) ?
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary remove"
                                                    onClick={() => handleClickRemove(value)}
                                                >
                                                    Remove
                                                </button>
                                                :
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary add"
                                                    onClick={() => handleClickAdd(value)}
                                                >
                                                    Add
                                                </button>
                                        }

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="right-section">
                    <div className="top-section">
                        <h1 className="title">Order</h1>
                    </div>
                    <div className="bottom-section">
                        <div className="order">
                            <div className="pad">
                                {
                                    transactionItemMaps?.map((value, index) => (
                                        <div key={index} className="transaction-item-map">
                                            <div className="left-section">
                                                <div className="name">
                                                    {items!.find(item => item.id == value.itemId)?.name}
                                                </div>
                                                <div className="price">
                                                    Rp. {items!.find(item => item.id == value.itemId)?.unitSellPrice! * value.quantity!}
                                                </div>
                                            </div>
                                            <div className="right-section">
                                                <div className="button decrement">
                                                    <Image src={MinusIcon} alt="minus"
                                                           className="image button decrement"
                                                           onClick={() => handleClickDecrement(value)}/>
                                                </div>
                                                <div className="text quantity">
                                                    {value.quantity}
                                                </div>
                                                <div className="button increment">
                                                    <Image src={PlusIcon} alt="plus" className="image"
                                                           onClick={() => handleClickIncrement(value)}/>
                                                </div>
                                            </div>

                                            <hr className="horizontal-line border opacity-100 w-100"/>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="summary">
                            <div className="pad">
                                <div className="total">
                                    <div className="top-section">Total</div>
                                    <hr className="border border-dark opacity-100 w-100 p-0 m-0"/>
                                    <div className="bottom-section">
                                        Rp. {totalPrice}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="checkout">
                            <button className="btn btn-primary" onClick={() => handleClickCheckout()}>
                                <PlusLg className="icon"/>
                                <div className="text">
                                    Checkout
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    )
}