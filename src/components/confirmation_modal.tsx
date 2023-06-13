import React from "react";
import {Modal} from "react-bootstrap";
import {QuestionCircleFill} from "react-bootstrap-icons";
import {useDispatch, useSelector} from "react-redux";
import "@/styles/components/message_modal.scss";
import confirmationModalSlice, {ConfirmationModalState} from "@/slices/confirmation_modal_slice";

export default function ConfirmationModal() {
    const confirmationModalState: ConfirmationModalState = useSelector((state: any) => state.confirmationModal);
    const {isShow, callback} = confirmationModalState

    const dispatch = useDispatch();

    const handleOnHide = () => {
        dispatch(confirmationModalSlice.actions.configure({...confirmationModalState, isShow: !isShow}))
    }

    const handleClickedYes = () => {
        dispatch(confirmationModalSlice.actions.configure({...confirmationModalState, isShow: !isShow}))
        callback()
    }

    const handleClickedNo = () => {
        dispatch(confirmationModalSlice.actions.configure({...confirmationModalState, isShow: !isShow}))
    }


    return (
        <Modal className="message-modal" show={confirmationModalState.isShow} onHide={handleOnHide}>
            <Modal.Body className="body mt-4 mb-4">
                <div className="icon pb-4">
                    <QuestionCircleFill width="100" height="100" className="message-modal-icon text-primary"/>
                </div>
                <h4 className="content">{confirmationModalState.content}</h4>

                <div className="d-flex flex-row mt-3">
                    <button onClick={handleClickedYes} className="btn btn-success mx-3 px-4">Yes</button>
                    <button onClick={handleClickedNo} className="btn btn-danger mx-3 px-4">No</button>
                </div>
            </Modal.Body>
        </Modal>
    )
}
