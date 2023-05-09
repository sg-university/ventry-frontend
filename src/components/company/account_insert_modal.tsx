import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Modal } from "react-bootstrap";
import * as Yup from "yup";

import "@/styles/components/company/account_insert_modal.scss";
import { PageState } from "@/slices/page_slice";
import { useDispatch, useSelector } from "react-redux";
import message_modal_slice, { MessageModalState } from "@/slices/message_modal_slice";
import RoleService from "@/services/role_service";
import Role from "@/models/entities/role";
import Content from "@/models/value_objects/contracts/content";
import { AxiosResponse } from "axios";
import LocationService from "@/services/location_service";
import Location from "@/models/entities/location";
import AccountService from "@/services/account_service";
import CreateOneRequest from "@/models/value_objects/contracts/requests/managements/accounts/create_one_request";

const insertSchema = Yup.object().shape({
  name: Yup.string("Must be string").required("Required"),
  roleId: Yup.string("Must be string").required("Required"),
  locationId: Yup.string("Must be string").required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
  confirmPassword: Yup.string()
      .required("Required")
      .oneOf([Yup.ref("password"), ""], "Passwords must match"),
});

function MainComponent(props) {
  const { getAllAccount } = props
  const [roles, setRoles] = useState([] as Object[])
  const [locations, setLocations] = useState([] as Object[])
  const dispatch = useDispatch();
  console.log(roles)
  
  const getRoles = () => {
    const roleService = new RoleService()
    roleService
      .readAll()
      .then((result: AxiosResponse<Content<Role[]>>) => {
        const content = result.data;
        setRoles(content.data)
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
    getRoles()
    getLocations()
  }, [])

  const handleInsertSubmit = (values: any, actions: any) => {
    const accountService = new AccountService()
    const request: CreateOneRequest = {
      body: {
        roleId: values.roleId,
        locationId: values.locationId,
        name: values.name,
        email: values.email,
        password: values.password,
      }
    }
    accountService
      .createOne(request)
      .then(() => {
        getAllAccount()
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
        props.handleShow()
      });
  }

  return (
    <div className="main form">
      <Formik
        validationSchema={insertSchema}
        initialValues={{
          name: "",
          roleId: roles.length > 0 ? roles[0].id : "",
          locationId: locations.length > 0 ? locations[0].id : "",
          email: "",
          password: "",
          confirmPassword: ""
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
              <fieldset className="form-group pb-2">
                <label htmlFor="roleId" className="pb-1">Select Role</label>
                <Field as="select" name="roleId" className="form-control select-item">
                  {roles.map((val, idx) => (
                    <option key={val.id} value={val.id}>{ val.name }</option>
                  ))}
                </Field>
                <ErrorMessage
                  name="roleId"
                  component="div"
                  className="text-danger"
                />
              </fieldset>
              <fieldset className="form-group pb-2">
                <label htmlFor="locationId" className="pb-1">Select Location</label>
                <Field as="select" name="locationId" className="form-control select-item">
                  {locations.map((val, idx) => (
                    <option key={val.id} value={val.id}>{ val.name }</option>
                  ))}
                </Field>
                <ErrorMessage
                  name="locationId"
                  component="div"
                  className="text-danger"
                />
              </fieldset>
            </div>
            <div className="row">
              <fieldset className="form-group">
                <label htmlFor="email">Email</label>
                <Field
                  type="email"
                  name="email"
                  className="form-control"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-danger"
                />
              </fieldset>
            </div>
            <div className="row">
              <fieldset className="form-group">
                <label htmlFor="password">Password</label>
                <Field
                  type="password"
                  name="password"
                  className="form-control"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-danger"
                />
              </fieldset>
            </div>
            <div className="row">
              <fieldset className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <Field
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                />
                <ErrorMessage
                  name="confirmPassword"
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
                Insert Account
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default function AccountInsertModalComponent(props) {
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
      className="component account-insert-modal"
    >
      <Modal.Header closeButton className="header">
        <Modal.Title>Insert Account</Modal.Title>
      </Modal.Header>

      <Modal.Body className="body">
        {
          // Menu switch.
          {
            main: (
              <MainComponent
                handleShow={handleShow}
                getAllAccount={props.getAllAccount}
              />
            ),
          }[menu]
        }
      </Modal.Body>
    </Modal>
  );
}
