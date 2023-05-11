import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Modal, Nav } from "react-bootstrap";
import * as Yup from "yup";

import {useDispatch, useSelector} from "react-redux";
import message_modal_slice, { MessageModalState } from "@/slices/message_modal_slice";
import PatchOneByIdRequest from "@/models/value_objects/contracts/requests/managements/locations/patch_one_by_id_request";
import LocationService from "@/services/location_service";
import "@/styles/components/managements/locations/location_update_modal.scss"

const updateSchema = Yup.object().shape({
  name: Yup.string("Must be string").required("Required"),
  description: Yup.string("Must be string").required("Required"),
  address: Yup.string("Must be string").required("Required"),
});

function MainComponent(props) {
  const { getAllLocations, location, handleShow } = props
  const dispatch = useDispatch();

  const handleUpdateSubmit = (values: any, actions: any) => {
    const locationService = new LocationService()
    const request: PatchOneByIdRequest= {
      id: location.id,
      body: {
        companyId: location.companyId,
        name: values.name,
        description: values.description,
        address: values.address
      }
    }
    locationService
      .patchOneById(request)
      .then(() => {
        getAllLocations()
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
    <div className="main">
      <div className="form">
        <Formik
          validationSchema={updateSchema}
          initialValues={{
            name: location.name,
            description: location.description,
            address: location.address
          }}
          onSubmit={handleUpdateSubmit}
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
                  Update Location
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default function LocationUpdateModalComponent(props) {
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
      className="component location-update-modal"
    >
      <Modal.Header closeButton className="header">
        <Modal.Title>Location Update</Modal.Title>
      </Modal.Header>

      <Modal.Body className="body">
        {
          // Menu switch.
          {
            main: (
              <MainComponent
                handleShow={handleShow}
                location={props.location}
                getAllLocations={props.getAllLocations}
              />
            ),
          }[menu]
        }
      </Modal.Body>
    </Modal>
  );
}
