import React from "react";
import {Modal} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";

import pageSlice, {PageState} from "@/slices/page_slice";
import "@/styles/components/managements/companies/account_view_modal.scss";
import message_modal_slice from "@/slices/message_modal_slice";
import AccountService from "@/services/account_service";
import Content from "@/models/value_objects/contracts/content";
import Account from "@/models/entities/account";


export default function AccountViewModalComponent() {
    const accountService = new AccountService()
    const pageState: PageState = useSelector((state: any) => state.page);
    const {
        companyAccounts,
        isShowModal,
        currentAccount,
        currentRole,
        currentLocation
    } = pageState.companyAccountManagement;
    const dispatch = useDispatch();

    const handleShowModal = () => {
        dispatch(pageSlice.actions.configureCompanyAccountManagement({
                ...pageState.companyAccountManagement,
                isShowModal: !pageState.companyAccountManagement.isShowModal,
            })
        )
    };

    const handleModalUpdate = () => {
        dispatch(pageSlice.actions.configureCompanyAccountManagement({
                ...pageState.companyAccountManagement,
                currentModal: "updateModal"
            })
        )
    }

    const handleModalDelete = () => {
        accountService
            .deleteOneById({
                id: currentAccount?.id
            })
            .then((response) => {
                const content: Content<Account> = response.data
                dispatch(message_modal_slice.actions.configure({
                    content: content.message,
                    isShow: true
                }))
                dispatch(pageSlice.actions.configureCompanyAccountManagement({
                        ...pageState.companyAccountManagement,
                        isShowModal: !isShowModal,
                        currentModal: "",
                        currentAccount: null,
                        companyAccounts: companyAccounts?.filter((account) => account.id !== currentAccount?.id)
                    })
                )
            })
            .catch((error) => {
                console.log(error)
                dispatch(message_modal_slice.actions.configure({
                    content: error.message,
                    type: "failed",
                    isShow: true
                }))
            });
    }


    return (
        <Modal
            show={isShowModal}
            onHide={() => handleShowModal()}
            centered
            className="component account-view-modal"
        >
            <Modal.Header closeButton className="header">
                <Modal.Title>Account Details</Modal.Title>
            </Modal.Header>

            <Modal.Body className="body">
                <div className="main">
                    <div className="id">
                        <div className="text">{`ID: ${currentAccount?.id}`}</div>
                    </div>
                    <div className="name">
                        <div className="text">{`Name: ${currentAccount?.name}`}</div>
                    </div>
                    <div className="email">
                        <div className="text">{`Email: ${currentAccount?.email}`}</div>
                    </div>
                    <div className="role">
                        <div className="text">{`Role: ${currentRole?.name}`}</div>
                    </div>
                    <div className="location">
                        <div className="text">{`Location: ${currentLocation?.name}`}</div>
                    </div>
                    <div className="address">
                        <div className="text">{`Address: ${currentLocation?.address}`}</div>
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer className="footer">
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleModalUpdate()}
                >
                    Update
                </button>
                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleModalDelete()}
                >
                    Delete
                </button>
            </Modal.Footer>
        </Modal>
    );
}