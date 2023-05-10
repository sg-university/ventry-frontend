import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Modal, Nav } from "react-bootstrap";
import * as Yup from "yup";

import {useDispatch, useSelector} from "react-redux";
import "@/styles/components/company/account_update_modal.scss"
import message_modal_slice, { MessageModalState } from "@/slices/message_modal_slice";
import { AxiosResponse } from "axios";
import Content from "@/models/value_objects/contracts/content";
import AccountService from "@/services/account_service";
import PatchOneByIdRequest from "@/models/value_objects/contracts/requests/managements/accounts/patch_one_by_id_request";
import Account from "@/models/entities/account";
import RoleService from "@/services/role_service";
import Role from "@/models/entities/role";
import LocationService from "@/services/location_service";
import Location from "@/models/entities/location";

const updateSchema = Yup.object().shape({
  name: Yup.string("Must be string").required("Required"),
  roleId: Yup.string("Must be string").required("Required"),
  locationId: Yup.string("Must be string").required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
});

function MainComponent(props) {
  const { companyAccount, setCompanyAccount, getAllAccount } = props.companyAccountController
  const { setModal } = props
  const [roles, setRoles] = useState([] as Object[])
  const [locations, setLocations] = useState([] as Object[])
  const dispatch = useDispatch();

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
              type: "failed",
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
              type: "failed",
              content: error.message,
              isShow: true
          }
          dispatch(message_modal_slice.actions.configure(messageModalState))
      });
  }

  const handleUpdateSubmit = (values: any, actions: any) => {
    const accountService = new AccountService()
    const request: PatchOneByIdRequest = {
      id: companyAccount.id,
      body: {
        roleId: values.roleId,
        locationId: values.locationId,
        name: values.name,
        email: values.email,
        password: companyAccount.password,
      }
    }
    accountService
      .patchOneById(request)
      .then((result: AxiosResponse<Content<Account>>) => {
        const content = result.data
        setCompanyAccount(content.data)
        const messageModalState: MessageModalState = {
          title: "Status",
          type: "success",
          content: "Update Account Success",
          isShow: true
        }
        dispatch(message_modal_slice.actions.configure(messageModalState))
        getAllAccount()
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
        setModal("viewModal")
      });
  }

  useEffect(() => {
    getRoles()
    getLocations()
  }, [])

  return (
    <div className="main">
      <div className="form">
        <Formik
          validationSchema={updateSchema}
          initialValues={{
            name: companyAccount.name,
            roleId: companyAccount.roleId,
            locationId: companyAccount.locationId,
            email: companyAccount.email
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
                <fieldset className="form-group pb-2">
                  <label htmlFor="role" className="pb-1">Select Role</label>
                  <Field as="select" name="roleId" className="form-control select-item">
                    {roles.map((val, idx) => (
                      <option key={val.id} value={val.id}>{ val.name }</option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="role"
                    component="div"
                    className="text-danger"
                  />
                </fieldset>
                <fieldset className="form-group pb-2">
                  <label htmlFor="location" className="pb-1">Select Location</label>
                  <Field as="select" name="locationId" className="form-control select-item">
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
                  <label htmlFor="email">Email</label>
                  <Field
                    type="text"
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

              <hr />
              <div className="button">
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Update Account
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default function AccountUpdateModalComponent(props) {
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
      className="component account-update-modal"
    >
      <Modal.Header closeButton className="header">
        <Modal.Title>Account Update</Modal.Title>
      </Modal.Header>

      <Modal.Body className="body">
        {
          // Menu switch.
          {
            main: (
              <MainComponent
                companyAccountController={props.companyAccountController}
                setModal={props.setModal}
              />
            ),
          }[menu]
        }
      </Modal.Body>
    </Modal>
  );
}
