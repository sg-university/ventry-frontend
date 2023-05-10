import React, { useState, useEffect } from "react";

import Image from "next/image";
import {useDispatch, useSelector} from "react-redux";
import pageSlice, {PageState} from "@/slices/page_slice";
import {AxiosResponse} from "axios";
import Content from "@/models/value_objects/contracts/content";
import messageModalSlice, {MessageModalState} from "@/slices/message_modal_slice";
import Authenticated from "@/layouts/authenticated";
import ButtonPlusImage from "@/assets/images/control_button_plus.svg";
import ItemCardImage from "@/assets/images/item_management_card.svg";
import ReadOneLocationByIdRequest from "@/models/value_objects/contracts/requests/managements/locations/read_one_by_id_request";
import ReadOneCompanyByIdRequest from "@/models/value_objects/contracts/requests/managements/companies/read_one_by_id_request";
import Company from "@/models/entities/company";
import "@/styles/pages/managements/company/account.scss"
import LocationService from "@/services/location_service";
import CompanyService from "@/services/company_service";
import Location from "@/models/entities/location";
import message_modal_slice from "@/slices/message_modal_slice";
import AccountService from "@/services/account_service";
import Account from "@/models/entities/account";
import MessageModal from "@/components/message_modal";
import AccountViewModalComponent from "@/components/company/account_view_modal";
import AccountUpdateModalComponent from "@/components/company/account_update_modal";
import AccountInsertModalComponent from "@/components/company/account_insert_modal";

export default function CompanyAccount() {
  const [modal, setModal] = useState("")
  const [accounts, setAccounts] = useState([] as Object[])
  const pageState: PageState = useSelector((state: any) => state.page);

  const { account } = pageState.accountManagement
  const [company, setCompany] = useState({})
  const [companyAccount, setCompanyAccount] = useState({})
  const dispatch = useDispatch();
  
  const getLocations = async () => {
    const locationService = new LocationService();
    const request: ReadOneLocationByIdRequest = {
      id: account.locationId
    }
    locationService
      .readOneById(request)
      .then((result: AxiosResponse<Content<Location>>) => {
          const content = result.data;
          getCompany(content.data.companyId)
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

  const getCompany = (companyId: string) => {
    const companyService = new CompanyService();
    const request: ReadOneCompanyByIdRequest = {
      id: companyId
    }
    companyService
      .readOneById(request)
      .then((result: AxiosResponse<Content<Company>>) => {
          const content = result.data;
          setCompany(content.data)
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

  const getAllAccount = () => {
    const accountService = new AccountService()
    accountService
      .readAll()
      .then((result: AxiosResponse<Content<Account[]>>) => {
            const { data } = result.data;
            setAccounts(data)
        })
        .catch((error) => {
            console.log(error)
            const messageModalState: MessageModalState = {
                title: "Status",
                type: "failed",
                content: error.message,
                isShow: true
            }
            dispatch(messageModalSlice.actions.configure(messageModalState))
        });
  }

  useEffect(() => {
    getLocations()
    getAllAccount()
  }, [])

  const handleModalInsert = () => {
    setModal("insertModal")
  }

  const handleModalView = (val) => {
    setCompanyAccount(val)
    setModal("viewModal")
  }

  const companyAccountController = {
    companyAccount, 
    setCompanyAccount,
    setAccounts,
    getAllAccount
  }

  return (
    <Authenticated>
      <div className="page company-account">
        <MessageModal/>
        {modal == 'insertModal' && <AccountInsertModalComponent setModal={setModal} getAllAccount={getAllAccount}/>}
        {modal == 'viewModal' && <AccountViewModalComponent setModal={setModal} companyAccountController={companyAccountController}/>}
        {modal == 'updateModal' && <AccountUpdateModalComponent setModal={setModal} companyAccountController={companyAccountController}/>}
        <div className="header">
          <div className="left-section">
            <div className="title">
              <h1>Company Management</h1>
            </div>
            <div className="description">
              <div className="text">
                Company Account
              </div>
            </div>
          </div>
          <div className="right-section">
            <div className="control">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleModalInsert()}
              >
                <Image src={ButtonPlusImage} alt="plus" />
                Add Account
              </button>
            </div>
          </div>
        </div>

        <div className="body">
          {accounts.length <= 0 ? (
            <div className="empty-data">
              <div className="text">
                Your company account is empty, try to insert one!
              </div>
            </div>
          ) : null}
          {accounts.map((val, idx) => (
            <div key={val.id} className="card">
              <div className="image">
                <Image
                  src={ItemCardImage}
                  onError={(e) => {
                    e.target.src = ItemCardImage;
                  }}
                  alt="item"
                  className="image"
                />
              </div>
              <div className="content">
                <div className="name">
                  <div className="text">{val.name}</div>
                </div>
                <div className="role">
                  <div className="text">{val.role}</div>
                </div>
              </div>
              <div className="control">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => handleModalView(val)}
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Authenticated>
  );
}
