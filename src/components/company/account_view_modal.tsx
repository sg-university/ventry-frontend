import React from "react";
import {Modal} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";

import pageSlice, {PageState} from "@/slices/page_slice";
import "@/styles/components/company/account_view_modal.scss";
import message_modal_slice, {MessageModalState} from "@/slices/message_modal_slice";
import AccountService from "@/services/account_service";
import Content from "@/models/value_objects/contracts/content";
import Account from "@/models/entities/account";


export default function AccountViewModalComponent() {
    const accountService = new AccountService()
    const pageState: PageState = useSelector((state: any) => state.page);
    const {
        accounts,
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
                const messageModalState: MessageModalState = {
                    title: "Status",
                    content: content.message,
                    isShow: true
                }
                dispatch(message_modal_slice.actions.configure(messageModalState))
                dispatch(pageSlice.actions.configureCompanyAccountManagement({
                        ...pageState.companyAccountManagement,
                        isShowModal: false,
                        currentModal: "",
                        currentAccount: null,
                        accounts: accounts?.filter((account) => account.id !== currentAccount?.id)
                    })
                )
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
