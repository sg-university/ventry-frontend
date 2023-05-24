import React from "react";
import {Button, Modal} from "react-bootstrap";
import {Check2Circle, XCircle} from "react-bootstrap-icons";
import {useDispatch, useSelector} from "react-redux";
import messageModalSlice, {MessageModalState} from "@/slices/message_modal_slice";
import "@/styles/components/message_modal.scss";

export default function MessageModal() {
    const messageModalState: MessageModalState = useSelector((state: any) => state.messageModal);
    const {isShow} = messageModalState

    const dispatch = useDispatch();

    const handleOnHide = () => {
        dispatch(messageModalSlice.actions.configure({...messageModalState, isShow: !isShow}))
    }

    return (
        <Modal className="message-modal" show={messageModalState.isShow} onHide={handleOnHide}>
            <Modal.Body className="body mt-4 mb-4">
                <div className="icon pb-4">
                    {messageModalState.type == 'succeed' &&
                        <Check2Circle width="100" height="100" className="message-modal-icon text-success"/>}
                    {messageModalState.type == 'failed' &&
                        <XCircle width="100" height="100" className="message-modal-icon text-danger"/>}
                </div>
                <h4 className="content">{messageModalState.content}</h4>
                <Button variant="secondary" className="mt-4" onClick={handleOnHide}>Close</Button>
            </Modal.Body>
        </Modal>
    )
}
