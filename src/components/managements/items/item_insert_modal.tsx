import React from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Modal, Nav} from "react-bootstrap";
import * as Yup from "yup";
import ItemService from "@/services/item_service";
import pageSlice, {PageState} from "@/slices/page_slice";
import {useDispatch, useSelector} from "react-redux";
import Content from "@/models/value_objects/contracts/content";
import messageModalSlice from "@/slices/message_modal_slice";
import "@/styles/components/managements/items/item_insert_modal.scss";
import {AuthenticationState} from "@/slices/authentication_slice";
import Item from "@/models/entities/item";
import CreateOneRequest
    from "@/models/value_objects/contracts/requests/managements/inventory_controls/create_one_request";
import InventoryControlService from "@/services/inventory_control_service";
import Image from "next/image";
import ItemCardImage from "@/assets/images/item_management_card.svg";
import ImageUtility from "@/utilities/image_utility";

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
    const imageUtility: ImageUtility = new ImageUtility()
    const inventoryControlService = new InventoryControlService();
    const pageState: PageState = useSelector((state: any) => state.page);
    const itemService = new ItemService()
    const authenticationState: AuthenticationState = useSelector((state: any) => state.authentication);
    const {currentAccount} = authenticationState
    const {items, isShowModal} = pageState.itemManagement
    const dispatch = useDispatch();

    const recordChanges = (currentItem: Item) => {
        const date = new Date()
        const request: CreateOneRequest = {
            body: {
                accountId: currentAccount?.id,
                itemId: currentItem?.id,
                quantityBefore: 0,
                quantityAfter: currentItem?.quantity,
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

    const handleSubmitInsert = (values: any, actions: any) => {
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
                    items: [content.data, ...items!],
                    isShowModal: !isShowModal,
                    currentModal: "noModal"
                }))
                if (values.is_record) {
                    recordChanges(content.data)
                }
                dispatch(messageModalSlice.actions.configure({
                    type: "succeed",
                    content: "Insert Item succeed.",
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
                currentModal: "noModal"
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
                    image: undefined,
                    is_record: true,
                }}
                onSubmit={handleSubmitInsert}
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

                        <div className="row">
                            <fieldset className="form-group">
                                Image:
                                <div className="image mb-3">
                                    <Image
                                        src={props.values.image ? imageUtility.blobToBase64AsData(props.values.image) : ItemCardImage}
                                        width={298}
                                        height={160}
                                        alt="item"
                                    />
                                </div>
                                <label htmlFor="image">Upload Image</label>
                                <input name="image" type="file" className="form-control" accept="image/*"
                                       onChange={
                                           (event: any) => {
                                               const file = event.target.files[0];
                                               imageUtility
                                                   .resizeFile(file)
                                                   .then((resizedFile) => {
                                                       props.setFieldValue("image", resizedFile);
                                                   })
                                                   .catch((err) => {
                                                       console.log(err);
                                                   });
                                           }
                                       }
                                       onBlur={props.handleBlur}
                                />
                                <ErrorMessage name="image" component="div" className="text-danger"/>
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
                                Cancel
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
    const dispatch = useDispatch();

    const handleShowModal = () => {
        dispatch(pageSlice.actions.configureItemManagement({
                ...pageState.itemManagement,
                isShowModal: !isShowModal,
                currentModal: "noModal"
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