import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Modal, Nav } from "react-bootstrap";
import * as Yup from "yup";
import ItemService from "@/services/item_service";
import pageSlice, {PageState} from "@/slices/page_slice";
import {useDispatch, useSelector} from "react-redux";
import ItemCardImage from "../../assets/images/item-management-card-img.svg";
import {AxiosResponse} from "axios";
import Content from "@/models/value_objects/contracts/content";
import Item from "@/models/entities/item";
import messageModalSlice, {MessageModalState} from "@/slices/message_modal_slice";
import ItemBundleService from "@/services/item_bundle_map_service";
import CreateOneItemRequest from "@/models/value_objects/contracts/requests/managements/items/create_one_request";
import CreateOneItemBundleRequest from "@/models/value_objects/contracts/requests/managements/item_bundle_maps/create_one_request";
import "@/styles/components/item_management/item_insert_modal.scss";
import LocationService from "@/services/location_service";
import Location from "@/models/entities/location";
import message_modal_slice from "@/slices/message_modal_slice";

const insertMainSchema = Yup.object().shape({
  code: Yup.string("Must be string").required("Required"),
  location: Yup.string("Must be string").required("Required"),
  type: Yup.string("Must be string").required("Required"),
  name: Yup.string("Must be string").required("Required"),
  quantity: Yup.number("Must be number")
    .required("Required")
    .min(0, "Min 0"),
  unitName: Yup.string("Must be string").required("Required"),
  unitCostPrice: Yup.number("Must be number")
    .required("Required")
    .min(1, "Min 1"),
  unitSellPrice: Yup.number("Must be number")
    .required("Required")
    .min(1, "Min 1"),
  description: Yup.string("Must be string").required("Required"),
});

const insertItemSchema = Yup.object().shape({
  superItem: Yup.string().required("Required"),
  subItem: Yup.string()
    .required("Required"),
    // .notOneOf([Yup.ref("superItem"), ""], "Sub-Item cannot be same as Items"),
  bundle_quantity: Yup.number("Must be number")
    .required("Required")
    .min(1, "Min 1"),
});

function MainComponent(props) {
  const pageState: PageState = useSelector((state: any) => state.page);
  const { getAllItems, handleShow } = props
  const { account } = pageState.accountManagement
  const [locations, setLocations] = useState([] as Object[])
  const dispatch = useDispatch();

  const handleInsertSubmit = (values: any, actions: any) => {
    console.log(values)
    const itemService = new ItemService()
    const request: CreateOneItemRequest = {
      body: {
        locationId: values.location,
        ...values
      }
    }
    itemService
      .createOne(request)
      .then(() => {
        getAllItems()
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
        handleShow()
      });
  }

  const getLocations = () => {
    const locationService = new LocationService()
    locationService
      .readAll()
      .then((result: AxiosResponse<Content<Location[]>>) => {
        const content = result.data;
        setLocations(content.data)
      })
      .catch((error) => {
          console.log(error)
          const messageModalState: MessageModalState = {
              title: "Status",
              content: error.message,
              isShow: true
          }
          dispatch(message_modal_slice.actions.configure(messageModalState))
      });
  }

  useEffect(() => {
    getLocations()
  }, [])

  return (
    <div className="main form">
      <Formik
        validationSchema={insertMainSchema}
        initialValues={{
          code: "",
          type: "",
          location: locations.length > 0 ? locations[0].id : "",
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
                <Field type="text" name="type" className="form-control" />
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
                <Field type="text" name="name" className="form-control" />
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
                    <option key={val.id} value={val.id}>{ val.name }</option>
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
            <hr/>
            <div className="button">
              <button
                type="submit"
                className="btn btn-primary"
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
          </Form>
        )}
      </Formik>
    </div>
  )
}

function ItemsComponent(props) {
  const { getAllItems, handleShow } = props
  const pageState: PageState = useSelector((state: any) => state.page);

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
      .then(() => {
        getAllItems()
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
        handleShow()
      });
  }
  
  return (
    <div className="items form">
      <Formik
        validationSchema={insertItemSchema}
        initialValues={{
          superItem: pageState.itemManagement.items[0].id,
          subItem: pageState.itemManagement.items[1].id,
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
                  {pageState.itemManagement.items.map((val, idx) => (
                    <option key={val.id} value={val.id}>{ val.name }</option>
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
                  {pageState.itemManagement.items.map((val, idx) => (
                    <option key={val.id} value={val.id}>{ val.name }</option>
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
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default function ItemInsertModalComponent(props) {
  const [isShow, setIsShow] = React.useState(true)
  const [menu, setMenu] = React.useState('main')

  const handleShow = () => {
    setIsShow(!isShow)
    props.setModal("")
  };

  const handleSelectMenu = (eventKey, e) => {
    setMenu(eventKey)
  }

  return (
    <Modal
      show={isShow}
      onHide={handleShow}
      centered
      className="component item-insert-modal"
    >
      <Modal.Header closeButton className="header">
        <Modal.Title>Insert Item</Modal.Title>
      </Modal.Header>
      <Nav variant="tabs" onSelect={handleSelectMenu}>
        <Nav.Item>
          <Nav.Link eventKey="main" className={menu == "main" ? "active" : "menu"}>Main</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="items" className={menu == "items" ? "active" : "menu"}>Items Bundle</Nav.Link>
        </Nav.Item>
      </Nav>

      <Modal.Body className="body">
        {
          // Menu switch.
          {
            main: (
              <MainComponent
                getAllItems={props.getAllItems}
                handleShow={handleShow}
                // ref={(ref) => {
                //   this.refMainComponent = ref;
                // }}
              />
            ),
            items: (
              <ItemsComponent
                getAllItems={props.getAllItems}
                handleShow={handleShow}
                menu={menu}
                // ref={(ref) => {
                //   this.refCombinationComponent = ref;
                // }}
              />
            ),
          }[menu]
        }
      </Modal.Body>
    </Modal>
  );
}