import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Modal, Nav } from "react-bootstrap";
import * as Yup from "yup";

import {useDispatch, useSelector} from "react-redux";
import "@/styles/components/inventory_control_history/inventory_control_update_modal.scss"
import { PageState } from "@/slices/page_slice";
import InventoryControlService from "@/services/inventory_control_service";
import PatchOneByIdRequest from "@/models/value_objects/contracts/requests/managements/inventory_controls/patch_one_by_id_request";
import message_modal_slice, { MessageModalState } from "@/slices/message_modal_slice";
import InventoryControl from "@/models/entities/inventory_control";
import { AxiosResponse } from "axios";
import Content from "@/models/value_objects/contracts/content";

const updateSchema = Yup.object().shape({
  name: Yup.string("Must be string").required("Required"),
  quantityBefore: Yup.number("Must be number").required("Required"),
  quantityAfter: Yup.number("Must be number").required("Required"),
});

function MainComponent(props) {
  const [item, setItem] = useState({})
  const { inventoryControl, setInventoryControl, getAllInventoryControl, handleShow } = props
  const pageState: PageState = useSelector((state: any) => state.page);
  const dispatch = useDispatch();
  const { items } = pageState.itemManagement
  const { account } = pageState.accountManagement
  const itemData = items.filter((item) => item.id === inventoryControl.itemId)

  useEffect(() => {
    setItem(itemData[0])
  }, [])

  const handleUpdateSubmit = (values: any, actions: any) => {
    const inventoryControlService = new InventoryControlService()
    const request: PatchOneByIdRequest = {
      id: inventoryControl.id,
      body: {
        accountId: account.id,
        itemId: inventoryControl.itemId,
        quantityBefore: values.quantityBefore,
        quantityAfter: values.quantityAfter,
        timestamp: inventoryControl.timestamp
      }
    }
    inventoryControlService
      .patchOneById(request)
      .then((result: AxiosResponse<Content<InventoryControl>>) => {
        const content = result.data
        setInventoryControl(content.data)
        handleShow()
        const messageModalState: MessageModalState = {
          title: "Status",
          type: "success",
          content: "Update Inventory Control Success",
          isShow: true
        }
        dispatch(message_modal_slice.actions.configure(messageModalState))
        getAllInventoryControl()
      })
      .catch((error) => {
          console.log(error)
          const messageModalState: MessageModalState = {
              title: "Status",
              type: "failed",
              content: error.message,
              isShow: true
          }
          dispatch(message_modal_slice.actions.configure(messageModalState))
      })
      .finally(() => {
        actions.setSubmitting(false);
      });
  }

  return (
    <div className="main">
      <div className="form">
        <Formik
          validationSchema={updateSchema}
          initialValues={{
            name: item.name,
            quantityBefore: inventoryControl.quantityBefore,
            quantityAfter: inventoryControl.quantityAfter
          }}
          onSubmit={handleUpdateSubmit}
          enableReinitialize
        >
          {(props) => (
            <Form>
               <div className="row">
                <fieldset className="form-group">
                  <label htmlFor="name">Item Name</label>
                  <Field
                    type="text"
                    name="name"
                    className="form-control"
                    disabled
                  />
                  <ErrorMessage
                    name="quantity"
                    component="div"
                    className="text-danger"
                  />
                </fieldset>
              </div>
              <div className="row">
                <fieldset className="form-group">
                  <label htmlFor="quantityBefore">Item Quantity Before</label>
                  <Field
                    type="number"
                    name="quantityBefore"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="quantity"
                    component="div"
                    className="text-danger"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <label htmlFor="quantityAfter">Item Quantity After</label>
                  <Field
                    type="number"
                    name="quantityAfter"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="quantityAfter"
                    component="div"
                    className="text-danger"
                  />
                </fieldset>
              </div>

              <hr />
              <div className="button">
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Update Control
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default function InventoryControlUpdateModalComponent(props) {
  const [isShow, setIsShow] = React.useState(true)
  const [menu, setMenu] = React.useState('main')

  const handleShow = () => {
    setIsShow(!isShow)
    props.setModal("")
  };

  return (
    <Modal
      show={isShow}
      onHide={handleShow}
      centered
      className="component item-update-modal"
    >
      <Modal.Header closeButton className="header">
        <Modal.Title>Inventory Control Update</Modal.Title>
      </Modal.Header>

      <Modal.Body className="body">
        {
          // Menu switch.
          {
            main: (
              <MainComponent
                inventoryControl={props.inventoryControl}
                setInventoryControl={props.setInventoryControl}
                getAllInventoryControl={props.getAllInventoryControl}
                handleShow={handleShow}
              />
            ),
          }[menu]
        }
      </Modal.Body>
    </Modal>
  );
}
