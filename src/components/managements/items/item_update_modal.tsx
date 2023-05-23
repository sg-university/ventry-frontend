import React, {useEffect} from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Modal, Nav} from "react-bootstrap";
import * as Yup from "yup";
import {useDispatch, useSelector} from "react-redux";
import pageSlice, {PageState} from "@/slices/page_slice";
import ItemBundleService from "@/services/item_bundle_map_service";
import ItemBundleMapService from "@/services/item_bundle_map_service";
import messageModalSlice from "@/slices/message_modal_slice";
import Image from "next/image";
import ItemCardImage from "@/assets/images/item_management_card.svg";
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
import InventoryControlService from "@/services/inventory_control_service";
import CreateOneRequest
    from "@/models/value_objects/contracts/requests/managements/inventory_controls/create_one_request";
import ItemBundleMap from "@/models/entities/item_bundle_map";
import "@/styles/components/managements/items/item_update_modal.scss"
import {AuthenticationState} from "@/slices/authentication_slice";

const updateMainSchema = Yup.object().shape({
    code: Yup.string().required("Required"),
    type: Yup.string().required("Required"),
    name: Yup.string().required("Required"),
    quantity: Yup.number().required("Required").min(0, "Min 0"),
    unitName: Yup.string().required("Required"),
    unitCostPrice: Yup.number().required("Required").min(1, "Min 1"),
    unitSellPrice: Yup.number().required("Required").min(1, "Min 1"),
    description: Yup.string().required("Required"),
});
const updateItemSchema = Yup.object().shape({
    superItem: Yup.string().required("Required"),
    subItem: Yup.string().required("Required").notOneOf([Yup.ref("superItem"), ""], "Sub-Item cannot be same as Items"),
    bundle_quantity: Yup.number().required("Required").min(1, "Min 1"),
});

function MainComponent() {
    const itemService: ItemService = new ItemService();
    const inventoryControlService = new InventoryControlService()
    const pageState: PageState = useSelector((state: any) => state.page);
    const {items, currentItem, currentLocation, isShowModal} = pageState.itemManagement;
    const authenticationState: AuthenticationState = useSelector((state: any) => state.authentication);
    const {currentAccount} = authenticationState
    const dispatch = useDispatch();

    const handleShow = () => {
        dispatch(pageSlice.actions.configureItemManagement({
            ...pageState.itemManagement,
            isShowModal: !isShowModal,
        }))
    }

    const recordChanges = (quantityBefore: number, quantityAfter: number) => {
        const date = new Date()
        const request: CreateOneRequest = {
            body: {
                accountId: currentAccount?.id,
                itemId: currentItem?.id,
                quantityBefore: quantityBefore,
                quantityAfter: quantityAfter,
                timestamp: date.toISOString()
            }
        }
        inventoryControlService.createOne(request).catch((error) => {
            console.log(error)
            dispatch(messageModalSlice.actions.configure({
                type: "failed",
                content: error.message,
                isShow: true
            }))
        })
    }
    const handleSubmitUpdate = (values: any, actions: any) => {
        const quantityBefore = currentItem?.quantity
        itemService.patchOneById({
            id: currentItem?.id,
            body: {...values, locationId: currentLocation?.id}
        }).then((response) => {
            const content: Content<Item> = response.data;
            recordChanges(quantityBefore!, values.quantity)
            dispatch(pageSlice.actions.configureItemManagement({
                ...pageState.itemManagement,
                items: items!.map((item) => {
                    if (item.id === content.data.id) {
                        return content.data
                    }
                    return item
                }),
                currentItem: content.data,
            }))
            dispatch(messageModalSlice.actions.configure({
                type: "succeed",
                content: "Update Item succeed.",
                isShow: true
            }))
        }).catch((error) => {
            console.log(error)
            dispatch(messageModalSlice.actions.configure({
                type: "failed",
                content: error.message,
                isShow: true
            }))
        }).finally(() => {
            actions.setSubmitting(false);
        });
    }
    return (<div className="main">
        <div className="form">
            <Formik validationSchema={updateMainSchema}
                    initialValues={{...currentItem!, is_record: false,}}
                    onSubmit={handleSubmitUpdate}
                    enableReinitialize
            >
                {(props) => (
                    <Form>
                        <div className="row">
                            <fieldset className="form-group"><label htmlFor="code">Code</label>
                                <Field type="text" name="code" className="form-control"/>
                                <ErrorMessage name="code" component="div" className="text-danger"/>
                            </fieldset>
                            <fieldset className="form-group"><label htmlFor="type">Type</label>
                                <Field type="text" name="type" className="form-control"/>
                                <ErrorMessage name="type" component="div" className="text-danger"/>
                            </fieldset>
                        </div>
                        <div className="row">
                            <fieldset className="form-group"><label htmlFor="name">Name</label>
                                <Field type="text" name="name" className="form-control"/>
                                <ErrorMessage name="name" component="div" className="text-danger"/>
                            </fieldset>
                        </div>
                        <div className="row">
                            <fieldset className="form-group"><label htmlFor="quantity">Quantity</label>
                                <Field type="number" name="quantity" className="form-control"/>
                                <ErrorMessage name="quantity" component="div" className="text-danger"/>
                            </fieldset>
                            <fieldset className="form-group"><label htmlFor="unitName">Unit Name</label>
                                <Field type="text" name="unitName" className="form-control"/>
                                <ErrorMessage name="unitName" component="div" className="text-danger"/>
                            </fieldset>
                        </div>
                        <div className="row">
                            <fieldset className="form-group"><label htmlFor="unitCostPrice">Cost</label>
                                <Field
                                    type="number" name="unitCostPrice" className="form-control"/>
                                <ErrorMessage name="unitCostPrice" component="div" className="text-danger"/>
                            </fieldset>
                            <fieldset className="form-group"><label htmlFor="unitSellPrice">Price</label>
                                <Field
                                    type="number" name="unitSellPrice" className="form-control"/>
                                <ErrorMessage name="unitSellPrice" component="div" className="text-danger"/>
                            </fieldset>
                        </div>
                        <div className="row">
                            <fieldset className="form-group"><label htmlFor="description">Description</label>
                                <Field
                                    as="textarea" type="text" name="description" className="form-control"/>
                                <ErrorMessage name="description" component="div" className="text-danger"/>
                            </fieldset>
                        </div>
                        <div className="row">
                            <fieldset className="form-group">
                                <div className="image"> Image:{" "} <Image src={ItemCardImage} alt="item"/></div>
                            </fieldset>
                        </div>
                        <div className="row">
                            <div className="is_record">
                                <Field
                                    type="checkbox" id="is_record" name="is_record" className="form-check-input "/>
                                <label htmlFor="is_record" className="is_record_label">
                                    Is record to Inventory Control History?
                                </label>
                            </div>
                        </div>
                        <hr/>
                        <div className="button">
                            <button type="submit" className="btn btn-primary">Update</button>
                        </div>
                    </Form>
                )
                }
            </Formik></div>
    </div>);
}

function ItemBundleComponent() {
    const itemBundleMapService: ItemBundleMapService = new ItemBundleMapService();
    const pageState: PageState = useSelector((state: any) => state.page);
    const {items, currentItem, currentItemBundleMaps, isShowModal} = pageState.itemManagement
    const dispatch = useDispatch();

    useEffect(() => {
        fetchCurrentItemBundleMaps()
    }, [])

    const fetchCurrentItemBundleMaps = () => {
        itemBundleMapService.readAllBySuperItemId({superItemId: currentItem?.id}).then((response) => {
            const content: Content<ItemBundleMap[]> = response.data;
            dispatch(pageSlice.actions.configureItemManagement({
                ...pageState.itemManagement,
                currentItemBundleMaps: content.data
            }))
        }).catch((error) => {
            console.log(error)
        })
    }

    const handleShow = () => {
        dispatch(pageSlice.actions.configureItemManagement({
            ...pageState.itemManagement,
            isShowModal: !isShowModal
        }))
    }


    const handleInsertItemBundle = () => {
        dispatch(pageSlice.actions.configureItemManagement({
            ...pageState.itemManagement,
            currentModalMenu: "itemBundleForm",
            currentAction: "insert"
        }))
    }
    const handleUpdateClick = (itemBundle: ItemBundleMap) => {
        dispatch(pageSlice.actions.configureItemManagement({
            ...pageState.itemManagement,
            currentItemBundle: itemBundle,
            currentModalMenu: "itemBundleForm",
            currentAction: "update"
        }))
    }
    const handleDeleteClick = (itemBundle: ItemBundleMap) => {
        const request: DeleteOneByIdRequest = {id: itemBundle.id}
        itemBundleMapService.deleteOneById(request).then(() => {
            fetchCurrentItemBundleMaps()
            dispatch(messageModalSlice.actions.configure({
                type: "succeed",
                content: "Delete Sub-Item succeed.",
                isShow: true
            }))
        }).catch((error) => {
            console.log(error)
            dispatch(messageModalSlice.actions.configure({
                type: "failed",
                content: error.message,
                isShow: true
            }))
        })
    }
    return (<div className="items form">
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
                <tbody> {currentItemBundleMaps && currentItemBundleMaps.map((value, index) => {
                    return (
                        <tr key={value.id}>
                            <td>{value.subItemId}</td>
                            <td>{items!.find(item => item.id === value.subItemId)?.name}</td>
                            <td>{value.quantity}</td>
                            <td className="action">
                                <PencilFill className="icon" onClick={() => handleUpdateClick(value)}/>
                                <Trash3Fill className="icon" onClick={() => handleDeleteClick(value)}/>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
        <div className="button">
            <button type="button" className="btn btn-primary" onClick={() => handleInsertItemBundle()}> Insert Item
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => handleShow()}> Close</button>
        </div>
    </div>);
}

function ItemBundleForm(props: any) {
    const itemBundleService = new ItemBundleService()
    const pageState: PageState = useSelector((state: any) => state.page);
    const {items, currentItem, currentAction, currentItemBundle, isShowModal} = pageState.itemManagement
    const dispatch = useDispatch();
    const isInsert = currentAction == 'insert'
    const fetchCurrentItemBundleMaps = () => {
        itemBundleService.readAllBySuperItemId({superItemId: currentItem?.id}).then((response) => {
            const content: Content<ItemBundleMap[]> = response.data;
            dispatch(pageSlice.actions.configureItemManagement({
                ...pageState.itemManagement,
                currentModalMenu: "itemBundle",
                currentItemBundleMaps: content.data
            }))
        }).catch((error) => {
            console.log(error)
        })
    }
    const handleSubmitUpdate = (values: any, actions: any) => {
        const request: PatchOneItemBundleByIdRequest = {
            id: currentItemBundle?.id,
            body: {superItemId: currentItem?.id, subItemId: values.subItem, quantity: values.bundle_quantity}
        }
        itemBundleService.patchOneById(request).then((result) => {
            fetchCurrentItemBundleMaps()
            dispatch(messageModalSlice.actions.configure({
                type: "succeed",
                content: "Update Sub-Item succeed.",
                isShow: true
            }))
        }).catch((error) => {
            console.log(error)
            dispatch(messageModalSlice.actions.configure({

                type: "failed",
                content: error.message,
                isShow: true
            }))
        }).finally(() => {
            actions.setSubmitting(false);
        });
    }
    const handleSubmitInsert = (values: any, actions: any) => {
        const itemBundleService = new ItemBundleService()
        const request: CreateOneItemBundleRequest = {
            body: {
                superItemId: currentItem?.id,
                subItemId: values.subItem,
                quantity: values.bundle_quantity
            }
        }
        itemBundleService.createOne(request).then((response) => {
            const content: Content<ItemBundleMap> = response.data;
            fetchCurrentItemBundleMaps()
            dispatch(messageModalSlice.actions.configure({
                type: "succeed",
                content: "Insert Sub-Item succeed.",
                isShow: true
            }))
        }).catch((error) => {
            console.log(error)
            dispatch(messageModalSlice.actions.configure({
                type: "failed",
                content: error.message,
                isShow: true
            }))
        }).finally(() => {
            actions.setSubmitting(false);
        });
    }
    const handleSubmit = (values: any, actions: any) => {
        switch (currentAction) {
            case "insert":
                handleSubmitInsert(values, actions)
                break;
            case "update":
                handleSubmitUpdate(values, actions)
                break;
            default:
                break;
        }
    }

    const handleShow = () => {
        dispatch(pageSlice.actions.configureItemManagement({
            ...pageState.itemManagement,
            isShowModal: !isShowModal
        }))
    }

    return (
        <div className="items form">
            <div className="items form">
                <Formik
                    validationSchema={updateItemSchema}
                    initialValues={{
                        superItem: currentItem?.name,
                        subItem: isInsert ? currentItem?.id : currentItemBundle?.subItemId,
                        bundle_quantity: isInsert ? 0 : currentItemBundle?.quantity
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
                                    <ErrorMessage name="superItem" component="div" className="text-danger"/>
                                </fieldset>
                            </div>
                            <div className="row">
                                <fieldset className="form-group pb-2">
                                    <label htmlFor="subItem" className="pb-1">Sub-Items</label>
                                    <Field as="select" name="subItem" className="form-control select-item">
                                        {items && items.map((val, idx) => (
                                            <option key={val.id} value={val.id}>{val.name}</option>))
                                        }
                                    </Field>
                                    <ErrorMessage name="subItem" component="div" className="text-danger"/>
                                </fieldset>
                                <fieldset className="form-group pb-2">
                                    <label htmlFor="bundle_quantity" className="pb-1">Quantity</label>
                                    <Field type="number" name="bundle_quantity" className="form-control select-item"/>
                                    <ErrorMessage name="bundle_quantity" component="div" className="text-danger"/>
                                </fieldset>
                            </div>
                            <hr/>
                            <div className="button">
                                <button type="submit" className="btn btn-primary">
                                    {isInsert ? "Insert Item" : "Update Item"}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => handleShow()}>
                                    Close
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>);
}

export default function ItemUpdateModalComponent() {
    const pageState: PageState = useSelector((state: any) => state.page);
    const {currentModalMenu, isShowModal} = pageState.itemManagement;
    const dispatch = useDispatch();
    const handleShow = () => {
        dispatch(pageSlice.actions.configureItemManagement({
            ...pageState.itemManagement,
            isShowModal: !isShowModal,
        }));
    }
    const handleSelectModalMenu = (eventKey: string | null) => {
        dispatch(pageSlice.actions.configureItemManagement({...pageState.itemManagement, currentModalMenu: eventKey}))
    }
    return (
        <Modal show={isShowModal} onHide={() => handleShow()} centered className="component item-update-modal">
            <Modal.Header closeButton className="header">
                <Modal.Title>Item Update</Modal.Title>
            </Modal.Header>
            <Nav variant="tabs" onSelect={(eventKey) => handleSelectModalMenu(eventKey)}>
                <Nav.Item>
                    <Nav.Link eventKey="main" className={currentModalMenu == "main" ? "active" : "menu"}>
                        Main
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="itemBundle" className={currentModalMenu == "itemBundle" ? "active" : "menu"}>
                        Items Bundle
                    </Nav.Link>
                </Nav.Item>
            </Nav>
            <Modal.Body className="body">
                {
                    {
                        main: <MainComponent/>,
                        itemBundle: <ItemBundleComponent/>,
                        itemBundleForm: <ItemBundleForm/>
                    }[currentModalMenu || "main"]
                }
            </Modal.Body>
        </Modal>
    );
}