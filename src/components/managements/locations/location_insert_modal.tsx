import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Modal } from "react-bootstrap";
import * as Yup from "yup";

import "@/styles/components/managements/companies/account_insert_modal.scss";
import { useDispatch, useSelector } from "react-redux";
import message_modal_slice, { MessageModalState } from "@/slices/message_modal_slice";
import LocationService from "@/services/location_service";
import CreateOneRequest from "@/models/value_objects/contracts/requests/managements/locations/create_one_request";
import "@/styles/components/managements/locations/location_insert_modal.scss"

const insertSchema = Yup.object().shape({
  name: Yup.string("Must be string").required("Required"),
  description: Yup.string("Must be string").required("Required"),
  address: Yup.string("Must be string").required("Required"),
});

function MainComponent(props) {
  const { getAllLocations, company, handleShow } = props
  const [locations, setLocations] = useState([] as Object[])
  const dispatch = useDispatch();

  const handleInsertSubmit = (values: any, actions: any) => {
    const locationService = new LocationService()
    const request: CreateOneRequest = {
      body: {
        companyId: company.id,
        name: values.name,
        description: values.description,
        address: values.address
      }
    }
    locationService
      .createOne(request)
      .then(() => {
        const messageModalState: MessageModalState = {
            title: "Status",
            type: "success",
            content: "Insert Location Success",
            isShow: true
        }
        dispatch(message_modal_slice.actions.configure(messageModalState))
        getAllLocations()
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
        handleShow()
      });
  }

  return (
    <div className="main form">
      <Formik
        validationSchema={insertSchema}
        initialValues={{
          name: "",
          description: "",
          address: ""
        }}
        onSubmit={handleInsertSubmit}
        enableReinitialize
      >
        {(props) => (
          <Form>
            <div className="row">
              <fieldset className="form-group">
                <label htmlFor="name">Name</label>
                <Field
                  type="text"
                  name="name"
                  className="form-control"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-danger"
                />
              </fieldset>
            </div>
            <div className="row">
              <fieldset className="form-group">
                <label htmlFor="description">Description</label>
                <Field
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
                <label htmlFor="address">Address</label>
                <Field
                  type="text"
                  name="address"
                  className="form-control"
                />
                <ErrorMessage
                  name="address"
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
                Insert Location
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default function LocationInsertModalComponent(props) {
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
      className="component location-insert-modal"
    >
      <Modal.Header closeButton className="header">
        <Modal.Title>Insert Location</Modal.Title>
      </Modal.Header>

      <Modal.Body className="body">
        {
          // Menu switch.
          {
            main: (
              <MainComponent
                handleShow={handleShow}
                company={props.company}
                getAllLocations={props.getAllLocations}
              />
            ),
          }[menu]
        }
      </Modal.Body>
    </Modal>
  );
}
