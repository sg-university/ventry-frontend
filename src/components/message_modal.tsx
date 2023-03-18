import React from "react";
import {Modal} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import messageModalSlice, {MessageModalState} from "@/slices/message_modal_slice";

export default function MessageModal(props: any) {


    const messageModalState: MessageModalState = useSelector((state: any) => state.messageModal);

    const dispatch = useDispatch();

    function handleOnHide() {
        dispatch(messageModalSlice.actions.configure({...messageModalState, isShow: false}))
    }

    return (
        <Modal show={messageModalState.isShow} onHide={handleOnHide}>
            <Modal.Header closeButton>
                {<Modal.Title>{messageModalState.title}</Modal.Title>}
            </Modal.Header>
            <Modal.Body>{messageModalState.content}</Modal.Body>
        </Modal>
    )
}
