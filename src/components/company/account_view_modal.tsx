import React, { useState, useEffect } from "react";
import { Modal, Nav } from "react-bootstrap";
import { useDispatch, useSelector} from "react-redux";

import {PageState} from "@/slices/page_slice";
import "@/styles/components/company/account_view_modal.scss";
import RoleService from "@/services/role_service";
import ReadOneRoleByIdRequest from "@/models/value_objects/contracts/requests/managements/roles/read_one_by_id_request";
import { AxiosResponse } from "axios";
import Content from "@/models/value_objects/contracts/content";
import Role from "@/models/entities/role";
import message_modal_slice, { MessageModalState } from "@/slices/message_modal_slice";
import LocationService from "@/services/location_service";
import ReadOneLocationByIdRequest from "@/models/value_objects/contracts/requests/managements/locations/read_one_by_id_request";
import Location from "@/models/entities/location";
import AccountService from "@/services/account_service";
import DeleteOneByIdRequest from "@/models/value_objects/contracts/requests/managements/accounts/delete_one_by_id_request";
import Account from "@/models/entities/account";

function MainComponent(props) {
  const { companyAccount } = props.companyAccountController
  const [role, setRole] = useState("")
  const [location, setLocation] = useState({})
  const dispatch = useDispatch();

  const getRole = () => {
    const roleService = new RoleService()
    const request: ReadOneRoleByIdRequest = {
      id: companyAccount.roleId
    } 
    roleService
      .readOneById(request)
      .then((result: AxiosResponse<Content<Role>>) => {
        const content = result.data;
        setRole(content.data.name)
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

  const getLocation = () => {
    const locationService = new LocationService()
    const request: ReadOneLocationByIdRequest = {
      id: companyAccount.locationId
    }
    locationService
      .readOneById(request)
      .then((result: AxiosResponse<Content<Location>>) => {
        const content = result.data;
        setLocation(content.data)
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
    getRole()
    getLocation()
  }, [])

  return (
    <div className="main">
      <div className="id">
        <div className="text">{`ID: ${companyAccount.id}`}</div>
      </div>
      <div className="name">
        <div className="text">{`Name: ${companyAccount.name}`}</div>
      </div>
      <div className="email">
        <div className="text">{`Email: ${companyAccount.email}`}</div>
      </div>
      <div className="role">
        <div className="text">{`Role: ${role}`}</div>
      </div>
      <div className="location">
        <div className="text">{`Location: ${location.name}`}</div>
      </div>
      <div className="address">
        <div className="text">{`Address: ${location.address}`}</div>
      </div>
    </div>
  );
}

export default function AccountViewModalComponent(props) {
  const [isShow, setIsShow] = React.useState(true)
  const [menu, setMenu] = React.useState('main')
  const { companyAccount, getAllAccount } = props.companyAccountController
  const dispatch = useDispatch();

  const handleShow = () => {
    setIsShow(!isShow)
    props.setModal("")
  };

  const handleModalUpdate = () => {
    props.setModal("updateModal")
  }

  const handleModalDelete = () => {
    const accountService = new AccountService()
    const request: DeleteOneByIdRequest = {
      id: companyAccount.id
    }
    accountService
      .deleteOneById(request)
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
      });
  }


  return (
    <Modal
      show={isShow}
      onHide={handleShow}
      centered
      className="component account-view-modal"
    >
      <Modal.Header closeButton className="header">
        <Modal.Title>Account Details</Modal.Title>
      </Modal.Header>

      <Modal.Body className="body">
        {
          // Menu switch.
          {
            main: (
              <MainComponent
                companyAccountController={props.companyAccountController}
              />
            ),
          }[menu]
        }
      </Modal.Body>

      <Modal.Footer className="footer">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => handleModalUpdate()}
        >
          Update Account
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => handleModalDelete()}
        >
          Delete Account
        </button>
      </Modal.Footer>
    </Modal>
  );
}
