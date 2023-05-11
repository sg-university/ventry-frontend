import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Modal } from "react-bootstrap";
import * as Yup from "yup";

import "@/styles/components/managements/histories/inventory_controls/inventory_control_insert_modal.scss";
import { PageState } from "@/slices/page_slice";
import { useDispatch, useSelector } from "react-redux";
import CreateOneRequest from "@/models/value_objects/contracts/requests/managements/inventory_controls/create_one_request";
import InventoryControlService from "@/services/inventory_control_service";
import message_modal_slice, { MessageModalState } from "@/slices/message_modal_slice";

const insertSchema = Yup.object().shape({
  quantityBefore: Yup.number("Must be number").required("Required"),
  quantityAfter: Yup.number("Must be number").required("Required"),
});

function MainComponent(props) {
  const [selectedItem, setSelectedItem] = useState(null)
  const { handleShow, getAllInventoryControl } = props
  const pageState: PageState = useSelector((state: any) => state.page);
  const { items } = pageState.itemManagement
  const { account } = pageState.accountManagement
  const dispatch = useDispatch();
  
  const handleClickSelect = (val) => {
    setSelectedItem(val);
  };

  const handleClickDelete = () => {
    setSelectedItem(null);
  };

  const handleInsertSubmit = (values: any, actions: any) => {
    const date = new Date()
    const inventoryControlService = new InventoryControlService()
    const request: CreateOneRequest = {
      body: {
        accountId: account.id,
        itemId: selectedItem.id,
        quantityBefore: values.quantityBefore,
        quantityAfter: values.quantityAfter,
        timestamp: date.toISOString()
      }
    }
    inventoryControlService
      .createOne(request)
      .then(() => {
        getAllInventoryControl()
      })
      .catch((error) => {
          console.log(error)
          const messageModalState: MessageModalState = {
              title: "Status",
              content: error.message,
              isShow: true
          }
          dispatch(message_modal_slice.actions.configure(messageModalState))
      })
      .finally(() => {
        actions.setSubmitting(false);
        handleShow()
      });
  }

  return (
    <div className="main ">
      <div className="form">
        <Formik
          validationSchema={insertSchema}
          initialValues={{
            quantityBefore: selectedItem == null ? 0 : selectedItem.quantity,
            quantityAfter: 0,
          }}
          onSubmit={handleInsertSubmit}
          enableReinitialize
        >
          {(props) => (
            <Form>
              <div className="column">
                <div className="table-p">
                  <table className="table ">
                    <thead>
                      <tr>
                        <th scope="col">Item ID</th>
                        <th scope="col">Code</th>
                        <th scope="col">Name</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((val, idx) => {
                        return (
                          <tr key={idx}>
                            <td>{val.id}</td>
                            <td>{val.code}</td>
                            <td>{val.name}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={() => handleClickSelect(val)}
                              >
                                Select
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="table-sp">
                  <table className="table ">
                    <thead>
                      <tr>
                        <th scope="col">Selected Item ID</th>
                        <th scope="col">Code</th>
                        <th scope="col">Name</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {
                          selectedItem != null && <>
                            <td>{selectedItem.id}</td>
                            <td>{selectedItem.code}</td>
                            <td>{selectedItem.name}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={() => handleClickDelete()}
                              >
                                Delete
                              </button>
                            </td>
                          </>
                        }
                      </tr>
                    </tbody>
                  </table>
                </div>
                <ErrorMessage
                  name="item_id"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="row">
                <fieldset className="form-group">
                  <label htmlFor="quantityBefore">Item Quantity Before</label>
                  <Field
                    type="number"
                    name="quantityBefore"
                    className="form-control"
                    disabled
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
                  Insert Control
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default function InventoryControlInsertModalComponent(props) {
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
      className="component item-insert-modal"
    >
      <Modal.Header closeButton className="header">
        <Modal.Title>Insert Inventory Control</Modal.Title>
      </Modal.Header>

      <Modal.Body className="body">
        {
          // Menu switch.
          {
            main: (
              <MainComponent
                handleShow={handleShow}
                getAllInventoryControl={props.getAllInventoryControl}
              />
            ),
          }[menu]
        }
      </Modal.Body>
    </Modal>
  );
}
