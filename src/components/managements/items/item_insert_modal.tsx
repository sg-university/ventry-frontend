import React from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Modal, Nav} from "react-bootstrap";
import * as Yup from "yup";
import ItemService from "@/services/item_service";
import pageSlice, {PageState} from "@/slices/page_slice";
import {useDispatch, useSelector} from "react-redux";
import Content from "@/models/value_objects/contracts/content";
import messageModalSlice from "@/slices/message_modal_slice";
import ItemBundleService from "@/services/item_bundle_map_service";
import CreateOneItemBundleRequest
    from "@/models/value_objects/contracts/requests/managements/item_bundle_maps/create_one_request";
import "@/styles/components/managements/items/item_insert_modal.scss";
import {AuthenticationState} from "@/slices/authentication_slice";
import Item from "@/models/entities/item";
import ItemBundleMap from "@/models/entities/item_bundle_map";

const insertMainSchema = Yup.object().shape({
    code: Yup.string().required("Required"),
    type: Yup.string().required("Required"),
    name: Yup.string().required("Required"),
    quantity: Yup.number()
        .required("Required")
        .min(0, "Min 0"),
    unitName: Yup.string().required("Required"),
    unitCostPrice: Yup.number()
        .required("Required")
        .min(1, "Min 1"),
    unitSellPrice: Yup.number()
        .required("Required")
        .min(1, "Min 1"),
    description: Yup.string().required("Required"),
});

const insertItemSchema = Yup.object().shape({
    superItem: Yup.string().required("Required"),
    subItem: Yup.string()
        .required("Required"),
    bundle_quantity: Yup.number()
        .required("Required")
        .min(1, "Min 1"),
});

function MainComponent() {
    const pageState: PageState = useSelector((state: any) => state.page);
    const itemService = new ItemService()
    const authenticationState: AuthenticationState = useSelector((state: any) => state.authentication);
    const {currentAccount} = authenticationState
    const {items, isShowModal} = pageState.itemManagement
    const dispatch = useDispatch();


    const handleInsertSubmit = (values: any, actions: any) => {
        itemService
            .createOne({
                body: {
                    locationId: currentAccount?.locationId,
                    ...values
                }
            })
            .then((response) => {
                const content: Content<Item> = response.data;
                dispatch(pageSlice.actions.configureItemManagement({
                    ...pageState.itemManagement,
                    items: [...(items!), content.data]
                }))
                dispatch(messageModalSlice.actions.configure({
                    type: "succeed",
                    content: content.message,
                    isShow: true
                }))
            })
            .catch((error) => {
                console.log(error)
                dispatch(messageModalSlice.actions.configure({
                    type: "failed",
                    content: error.message,
                    isShow: true
                }))
            })
            .finally(() => {
                actions.setSubmitting(false);
            });
    }


    const handleShowModal = () => {
        dispatch(pageSlice.actions.configureItemManagement({
                ...pageState.itemManagement,
                isShowModal: !isShowModal,
            })
        )
    }

    return (
        <div className="main form">
            <Formik
                validationSchema={insertMainSchema}
                initialValues={{
                    code: "",
                    type: "",
                    name: "",
                    quantity: 0,
                    unitName: "",
                    unitCostPrice: 0,
                    unitSellPrice: 0,
                    description: "",
                    image_url: "",
                }}
                onSubmit={handleInsertSubmit}
                enableReinitialize
            >
                {(props) => (
                    <Form>
                        <div className="row">
                            <fieldset className="form-group">
                                <label htmlFor="code">Code</label>
                                <Field type="text" name="code" className="form-control"/>
                                <ErrorMessage
                                    name="code"
                                    component="div"
                                    className="text-danger"
                                />
                            </fieldset>

                            <fieldset className="form-group">
                                <label htmlFor="type">Type</label>
                                <Field type="text" name="type" className="form-control"/>
                                <ErrorMessage
                                    name="type"
                                    component="div"
                                    className="text-danger"
                                />
                            </fieldset>
                        </div>

                        <div className="row">
                            <fieldset className="form-group">
                                <label htmlFor="name">Name</label>
                                <Field type="text" name="name" className="form-control"/>
                                <ErrorMessage
                                    name="name"
                                    component="div"
                                    className="text-danger"
                                />
                            </fieldset>
                        </div>

                        <div className="row">
                            <fieldset className="form-group">
                                <label htmlFor="quantity">Quantity</label>
                                <Field
                                    type="number"
                                    name="quantity"
                                    className="form-control"
                                />
                                <ErrorMessage
                                    name="quantity"
                                    component="div"
                                    className="text-danger"
                                />
                            </fieldset>

                            <fieldset className="form-group">
                                <label htmlFor="unitName">Unit Name</label>
                                <Field
                                    type="text"
                                    name="unitName"
                                    className="form-control"
                                />
                                <ErrorMessage
                                    name="unitName"
                                    component="div"
                                    className="text-danger"
                                />
                            </fieldset>
                        </div>

                        <div className="row">
                            <fieldset className="form-group">
                                <label htmlFor="unitCostPrice">Cost</label>
                                <Field
                                    type="number"
                                    name="unitCostPrice"
                                    className="form-control"
                                />
                                <ErrorMessage
                                    name="unitCostPrice"
                                    component="div"
                                    className="text-danger"
                                />
                            </fieldset>

                            <fieldset className="form-group">
                                <label htmlFor="unitSellPrice">Price</label>
                                <Field
                                    type="number"
                                    name="unitSellPrice"
                                    className="form-control"
                                />
                                <ErrorMessage
                                    name="unitSellPrice"
                                    component="div"
                                    className="text-danger"
                                />
                            </fieldset>
                        </div>

                        <div className="row">
                            <fieldset className="form-group">
                                <label htmlFor="description">Description</label>
                                <Field
                                    as="textarea"
                                    type="text"
                                    name="description"
                                    className="form-control"
                                />
                                <ErrorMessage
                                    name="description"
                                    component="div"
                                    className="text-danger"
                                />
                            </fieldset>
                        </div>
                        <hr/>
                        <div className="button">
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Insert
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => handleShowModal()}
                            >
                                Close
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

function ItemsComponent(props: any) {
    const {fetchItemsByLocation, handleShowModal} = props
    const pageState: PageState = useSelector((state: any) => state.page);
    const {items} = pageState.itemManagement

    const dispatch = useDispatch();

    const handleInsertSubmit = (values: any, actions: any) => {
        const itemBundleService = new ItemBundleService()
        const request: CreateOneItemBundleRequest = {
            body: {
                superItemId: values.superItem,
                subItemId: values.subItem,
                quantity: values.bundle_quantity
            }
        }
        itemBundleService
            .createOne(request)
            .then((response) => {
                const content: Content<ItemBundleMap> = response.data;
                dispatch(messageModalSlice.actions.configure({
                    type: "succeed",
                    content: content.message,
                    isShow: true
                }))
                fetchItemsByLocation()
            })
            .catch((error) => {
                console.log(error)
                dispatch(messageModalSlice.actions.configure({
                    type: "failed",
                    content: error.message,
                    isShow: true
                }))
            })
            .finally(() => {
                actions.setSubmitting(false);
                handleShowModal()
            });
    }

    return (
        <div className="items form">
            <Formik
                validationSchema={insertItemSchema}
                initialValues={{
                    superItem: items ? items[0].id : "",
                    subItem: items ? items[1].id : "",
                    bundle_quantity: 0
                }}
                onSubmit={handleInsertSubmit}
                enableReinitialize
            >
                {(props) => (
                    <Form className="items-form">
                        <div className="row">
                            <fieldset className="form-group pb-2">
                                <label htmlFor="superItem" className="pb-1">Select Items</label>
                                <Field as="select" name="superItem" className="form-control select-item">
                                    {items?.map((val, idx) => (
                                        <option key={val.id} value={val.id}>{val.name}</option>
                                    ))}
                                </Field>
                                <ErrorMessage
                                    name="superItem"
                                    component="div"
                                    className="text-danger"
                                />
                            </fieldset>
                        </div>
                        <div className="row">
                            <fieldset className="form-group pb-2">
                                <label htmlFor="subItem" className="pb-1">Select Sub-Items</label>
                                <Field as="select" name="subItem" className="form-control select-item">
                                    {items?.map((val, idx) => (
                                        <option key={val.id} value={val.id}>{val.name}</option>
                                    ))}
                                </Field>
                                <ErrorMessage
                                    name="subItem"
                                    component="div"
                                    className="text-danger"
                                />
                            </fieldset>
                            <fieldset className="form-group pb-2 quantity">
                                <label htmlFor="bundle_quantity" className="pb-1">Quantity</label>
                                <Field type="number" name="bundle_quantity" className="form-control"/>
                                <ErrorMessage
                                    name="bundle_quantity"
                                    component="div"
                                    className="text-danger"
                                />
                            </fieldset>
                        </div>
                        <hr/>
                        <div className="button">
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Insert
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => handleShowModal()}
                            >
                                Close
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default function ItemInsertModalComponent() {
    const pageState: PageState = useSelector((state: any) => state.page);
    const itemService = new ItemService()
    const {
        isShowModal,
        currentModalMenu
    } = pageState.itemManagement
    const authenticationState: AuthenticationState = useSelector((state: any) => state.authentication);
    const {currentAccount} = authenticationState
    const dispatch = useDispatch();

    const handleShowModal = () => {
        dispatch(pageSlice.actions.configureItemManagement({
                ...pageState.itemManagement,
                isShowModal: !isShowModal,
            })
        )
    }

    const handleSelectMenu = (eventKey: any) => {
        dispatch(pageSlice.actions.configureItemManagement({
                ...pageState.itemManagement,
                currentModalMenu: eventKey,
            })
        )
    }

    return (
        <Modal
            show={isShowModal}
            onHide={handleShowModal}
            centered
            className="component item-insert-modal"
        >
            <Modal.Header closeButton className="header">
                <Modal.Title>Insert Item</Modal.Title>
            </Modal.Header>
            <Nav variant="tabs" onSelect={handleSelectMenu}>
                <Nav.Item>
                    <Nav.Link eventKey="main" className={currentModalMenu == "main" ? "active" : "menu"}>Main</Nav.Link>
                </Nav.Item>
            </Nav>

            <Modal.Body className="body">
                {
                    // Menu switch.
                    {
                        main: <MainComponent/>,
                    }[currentModalMenu || "main"]
                }
            </Modal.Body>
        </Modal>
    );
}