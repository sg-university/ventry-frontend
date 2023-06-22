import React from "react";
import {Modal} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";

import pageSlice, {PageState} from "@/slices/page_slice";
import "@/styles/components/managements/companies/account_view_modal.scss";
import messageModalSlice from "@/slices/message_modal_slice";
import AccountService from "@/services/account_service";
import Content from "@/models/value_objects/contracts/content";
import Account from "@/models/entities/account";
import {AuthenticationState} from "@/slices/authentication_slice";
import confirmationModalSlice from "@/slices/confirmation_modal_slice";


export default function AccountViewModalComponent() {
    const accountService = new AccountService()

    const authenticationState: AuthenticationState = useSelector((state: any) => state.authentication);

    const {currentAccount: authenticationCurrentAccount} = authenticationState;

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
                currentModal: "noModal"
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
        const callback = () => {
            accountService
                .deleteOneById({
                    id: currentAccount?.id
                })
                .then((response) => {
                    const content: Content<Account> = response.data
                    dispatch(messageModalSlice.actions.configure({
                        content: content.message,
                        type: "succeed",
                        isShow: true
                    }))
                    dispatch(pageSlice.actions.configureCompanyAccountManagement({
                            ...pageState.companyAccountManagement,
                            isShowModal: !isShowModal,
                            currentModal: "noModal",
                            currentAccount: null,
                            companyAccounts: companyAccounts?.filter((account) => account.id !== currentAccount?.id)
                        })
                    )
                })
                .catch((error) => {
                    console.log(error)
                    dispatch(messageModalSlice.actions.configure({
                        content: error.message,
                        type: "failed",
                        isShow: true
                    }))
                });
        }

        dispatch(confirmationModalSlice.actions.configure({
            content: "Are you sure want to delete this account?",
            isShow: true,
            callback: callback
        }))
    }


    return (
        <Modal
            show={isShowModal}
            onHide={() => handleShowModal()}
            centered
            className="component account-view-modal"
        >
            <Modal.Header closeButton className="header">
                <Modal.Title>Company Account Details</Modal.Title>
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
                {
                    authenticationCurrentAccount?.id !== currentAccount?.id &&
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleModalDelete()}
                    >
                        Delete
                    </button>
                }
            </Modal.Footer>
        </Modal>
    );
}
