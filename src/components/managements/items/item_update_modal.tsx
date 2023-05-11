import React from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Modal, Nav} from "react-bootstrap";
import * as Yup from "yup";
import {useDispatch, useSelector} from "react-redux";
import pageSlice, {PageState} from "@/slices/page_slice";
import ItemBundleService from "@/services/item_bundle_map_service";
import ItemBundleMapService from "@/services/item_bundle_map_service";
import messageModalSlice, {MessageModalState} from "@/slices/message_modal_slice";
import Image from "next/image";
import ItemCardImage from "@/assets/images/item_management_card.svg";
import "@/styles/components/managements/items/item_update_modal.scss"
import ItemService from "@/services/item_service";
import PatchOneItemBundleByIdRequest
    from "@/models/value_objects/contracts/requests/managements/item_bundle_maps/patch_one_by_id_request";
import {PencilFill, Trash3Fill} from "react-bootstrap-icons";
import DeleteOneByIdRequest
    from "@/models/value_objects/contracts/requests/managements/item_bundle_maps/delete_one_by_id_request";
import CreateOneItemBundleRequest
    from "@/models/value_objects/contracts/requests/managements/item_bundle_maps/create_one_request";
import Content from "@/models/value_objects/contracts/content";
import Item from "@/models/entities/item";

const updateMainSchema = Yup.object().shape({
    code: Yup.string().required("Required"),
    location: Yup.string().required("Required"),
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

const updateItemSchema = Yup.object().shape({
    superItem: Yup.string().required("Required"),
    subItem: Yup.string()
        .required("Required")
        .notOneOf([Yup.ref("superItem"), ""], "Sub-Item cannot be same as Items"),
    bundle_quantity: Yup.number()
        .required("Required")
        .min(1, "Min 1"),
});

function MainComponent() {
    const itemService: ItemService = new ItemService();
    const itemBundleMapService: ItemBundleMapService = new ItemBundleMapService();
    const pageState: PageState = useSelector((state: any) => state.page);
    const {
        items,
        currentItem,
        currentItemBundleMaps,
        currentLocation,
        currentModalMenu,
        isShowModal,
    } = pageState.itemManagement;
    const dispatch = useDispatch();


    const handleUpdateSubmit = (value: any) => {
        itemService.patchOneById({
            id: currentItem?.id,
            body: {
                code: value.code,
                locationId: value.location,
                type: value.type,
                name: value.name,
                quantity: value.quantity,
                unitName: value.unitName,
                unitCostPrice: value.unitCostPrice,
                unitSellPrice: value.unitSellPrice,
                description: value.description,
            },
        }).then((response) => {
            const content: Content<Item> = response.data;

        })
    }

    return (
        <div className="main">
            <div className="form">
                <Formik
                    validationSchema={updateMainSchema}
                    initialValues={{
                        ...(currentItem || {}),
                        location: currentItem?.locationId,
                        is_record: false,
                    }}
                    onSubmit={(value) => handleUpdateSubmit(value)}
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
                                <fieldset className="form-group pb-2">
                                    <label htmlFor="location" className="pb-1">Location</label>
                                    <Field as="select" name="location" className="form-control select-item">
                                        {locations.map((val, idx) => (
                                            <option key={val.id} value={val.id}>{val.name}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage
                                        name="location"
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
                            <div className="row">
                                <fieldset className="form-group">
                                    <div className="image">
                                        Image:{" "}
                                        <Image
                                            src={ItemCardImage}
                                            onError={(e) => {
                                                e.target.src = ItemCardImage;
                                            }}
                                            alt="item"
                                        />
                                    </div>
                                </fieldset>
                            </div>
                            <div className="row">
                                <div className="is_record">
                                    {/* <fieldset className="form-check is_record"> */}
                                    <Field
                                        type="checkbox"
                                        id="is_record"
                                        name="is_record"
                                        className="form-check-input "
                                    />
                                    <label htmlFor="is_record" className="is_record_label">
                                        Is record to Inventory Control History?
                                    </label>
                                    {/* </fieldset> */}
                                </div>
                            </div>
                            <hr/>
                            <div className="button">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Update Item
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => handleShow()}
                                >
                                    Close
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

function ItemBundleComponent(props) {
    const {item, itemBundles, setMenu, setItemBundle, getAllItemBundle, setAction, handleShow} = props
    const pageState: PageState = useSelector((state: any) => state.page);
    const items = pageState.itemManagement.items
    const subItems = itemBundles.filter((itm) => itm.superItemId === item.id)
    const subItemsData = subItems.map(item1 => ({subItem: items.find(item2 => item2.id === item1.subItemId), ...item1}))

    const dispatch = useDispatch();

    const handleInsertItemBundle = (itemBundle) => {
        setMenu("itemBundleForm")
        setItemBundle(itemBundle)
        setAction("insert")
    }

    const handleUpdateClick = (itemBundle) => {
        setMenu("itemBundleForm")
        setItemBundle(itemBundle)
        setAction("update")
    }

    const handleDeleteClick = (itemBundle) => {
        const itemBundleService = new ItemBundleService()
        const request: DeleteOneByIdRequest = {
            id: itemBundle.id
        }
        itemBundleService
            .deleteOneById(request)
            .then((result) => {
                getAllItemBundle()
            })
            .catch((error) => {
                console.log(error)
                const messageModalState: MessageModalState = {
                    title: "Status",
                    content: error.message,
                    isShow: true
                }
                dispatch(messageModalSlice.actions.configure(messageModalState))
            })
    }

    return (
        <div className="items form">
            <div className="table-ic">
                <table className="table ">
                    <thead>
                    <tr>
                        <th scope="col">Child Item ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {subItemsData.map((val, idx) => {
                        return (
                            <tr key={idx}>
                                <td>{val.subItemId}</td>
                                <td>{val.subItem.name}</td>
                                <td>{val.quantity}</td>
                                <td className="action">
                                    <PencilFill className="icon" onClick={() => handleUpdateClick(val)}/>
                                    <Trash3Fill className="icon" onClick={() => handleDeleteClick(val)}/>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
            <div className="button">
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleInsertItemBundle}
                >
                    Insert Item
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleShow()}
                >
                    Close
                </button>
            </div>
        </div>
    );
}

function ItemBundleForm(props) {
    const {item, getAllItemBundle, setMenu, itemBundle, action} = props
    const pageState: PageState = useSelector((state: any) => state.page);

    const dispatch = useDispatch();

    const isInsert = action == 'insert'

    const handleUpdateSubmit = (values: any, actions: any) => {
        const itemBundleService = new ItemBundleService()
        const request: PatchOneItemBundleByIdRequest = {
            id: itemBundle.id,
            body: {
                superItemId: item.id,
                subItemId: values.subItem,
                quantity: values.bundle_quantity
            }
        }
        itemBundleService
            .patchOneById(request)
            .then((result) => {
                getAllItemBundle()
            })
            .catch((error) => {
                console.log(error)
                const messageModalState: MessageModalState = {
                    title: "Status",
                    content: error.message,
                    isShow: true
                }
                dispatch(messageModalSlice.actions.configure(messageModalState))
            })
            .finally(() => {
                actions.setSubmitting(false);
                setMenu("items")
            });
    }
    const handleInsertSubmit = (values: any, actions: any) => {
        const itemBundleService = new ItemBundleService()
        const request: CreateOneItemBundleRequest = {
            body: {
                superItemId: item.id,
                subItemId: values.subItem,
                quantity: values.bundle_quantity
            }
        }
        itemBundleService
            .createOne(request)
            .then(() => {
                getAllItemBundle()
            })
            .catch((error) => {
                console.log(error)
                const messageModalState: MessageModalState = {
                    title: "Status",
                    content: error.message,
                    isShow: true
                }
                dispatch(messageModalSlice.actions.configure(messageModalState))
            })
            .finally(() => {
                actions.setSubmitting(false);
                setMenu("items")
            });
    }
    const handleSubmit = (values: any, actions: any) => {
        switch (action) {
            case "insert":
                handleInsertSubmit(values, actions)
                break;
            case "update":
                handleUpdateSubmit(values, actions)
                break;
            default:
                break;
        }
    }

    return (
        <div className="items form">
            <div className="items form">
                <Formik
                    validationSchema={updateItemSchema}
                    initialValues={{
                        superItem: item.name,
                        subItem: isInsert ? item.id : itemBundle.subItemId,
                        bundle_quantity: isInsert ? 0 : itemBundle.quantity
                    }}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {() => (
                        <Form>
                            <div className="row">
                                <fieldset className="form-group pb-2">
                                    <label htmlFor="superItem" className="pb-1">Items</label>
                                    <Field type="text" name="superItem" className="form-control select-item" disabled/>
                                    <ErrorMessage
                                        name="superItem"
                                        component="div"
                                        className="text-danger"
                                    />
                                </fieldset>
                            </div>
                            <div className="row">
                                <fieldset className="form-group pb-2">
                                    <label htmlFor="subItem" className="pb-1">Sub-Items</label>
                                    {/* <Field type="text" name="subItem" className="form-control select-item"/> */}
                                    <Field as="select" name="subItem" className="form-control select-item">
                                        {pageState.itemManagement.items.map((val, idx) => (
                                            <option key={val.id} value={val.id}>{val.name}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage
                                        name="subItem"
                                        component="div"
                                        className="text-danger"
                                    />
                                </fieldset>
                                <fieldset className="form-group pb-2">
                                    <label htmlFor="bundle_quantity" className="pb-1">Quantity</label>
                                    <Field type="number" name="bundle_quantity" className="form-control select-item"/>
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
                                    {isInsert ? "Insert Item" : "Update Item"}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => handleShow()}
                                >
                                    Close
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export function ItemUpdateModalComponent() {
    const itemBundleMapService: ItemBundleMapService = new ItemBundleMapService();
    const pageState: PageState = useSelector((state: any) => state.page);
    const {
        items,
        currentItem,
        currentItemBundleMaps,
        currentLocation,
        currentModalMenu,
        isShowModal,
    } = pageState.itemManagement;
    const dispatch = useDispatch();

    const handleShow = () => {
        dispatch(pageSlice.actions.configureItemManagement({
            ...pageState.itemManagement,
            isShowModal: !isShowModal,
        }));
    }

    const handleSelectModalMenu = (eventKey: string | null) => {
        dispatch(pageSlice.actions.configureItemManagement({
                ...pageState.itemManagement,
                currentModalMenu: eventKey
            })
        )
    }

    return (
        <Modal
            show={isShowModal}
            onHide={() => handleShow()}
            centered
            className="component item-update-modal"
        >
            <Modal.Header closeButton className="header">
                <Modal.Title>Item Update</Modal.Title>
            </Modal.Header>

            <Nav variant="tabs" onSelect={(eventKey) => handleSelectModalMenu(eventKey)}>
                <Nav.Item>
                    <Nav.Link eventKey="main" className={currentModalMenu == "main" ? "active" : "menu"}>Main</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="itemBundle" className={currentModalMenu == "itemBundle" ? "active" : "menu"}>Items
                        Bundle</Nav.Link>
                </Nav.Item>
            </Nav>

            <Modal.Body className="body">
                {
                    {
                        main: <MainComponent />,
                        itemBundle: <ItemBundleComponent/>,
                    }[currentModalMenu || "main"]
                }
            </Modal.Body>
        </Modal>
    );
}
