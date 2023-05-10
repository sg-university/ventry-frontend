import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";

import {useDispatch,useSelector} from "react-redux";
import TransactionService from "@/services/transaction_service";
import DeleteOneByIdRequest from "@/models/value_objects/contracts/requests/managements/transactions/delete_one_by_id_request";
import TransactionItemMapService from "@/services/transaction_item_map_service";
import { AxiosResponse } from "axios";
import messageModalSlice, {MessageModalState} from "@/slices/message_modal_slice";
import Content from "@/models/value_objects/contracts/content";
import TransactionItemMap from "@/models/entities/transaction_item_map";
import { PageState } from "@/slices/page_slice";
import "@/styles/components/transaction_history/transaction_view_modal.scss"
import message_modal_slice from "@/slices/message_modal_slice";

function MainComponent(props) {
  const pageState: PageState = useSelector((state: any) => state.page);
  const { transaction, transactionItems } = props
  const items = pageState.itemManagement.items
  const transactionItem = transactionItems.filter((itm) => itm.transactionId === transaction.id)
  const transactionItemData = transactionItem.map(item1 => ({item:items.find(item2 => item2.id === item1.itemId), ...item1}))
  
  const convertDate = (dateTime) => {
    const date = new Date(dateTime).toDateString() 
    const time = new Date(dateTime).toLocaleTimeString()
    return date+" "+time
  }

  return (
    <div className="main">
      <div className="id">
        <div className="text">{`ID: ${transaction.id}`}</div>
      </div>
      <div className="timestamp">
        <div className="text">{`Date: ${convertDate(transaction.timestamp)}`}</div>
      </div>
      <div className="sellPrice">
        <div className="text">{`Total Price: Rp. ${transaction.sellPrice}`}</div>
      </div>
      <div className="column">
        <div className="table-p">
          <table className="table">
            <thead>
              <tr>
                <th scope="col" className="col-code">Code</th>
                <th scope="col" className="col-name">Name</th>
                <th scope="col" className="col-price">Price</th>
                <th scope="col" className="col-quantity">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {transactionItemData.map((val, idx) => {
                return (
                  <tr key={idx}>
                    <td>{val.item.code}</td>
                    <td>{val.item.name}</td>
                    <td>Rp. {val.sellPrice}</td>
                    <td>{val.quantity}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function TransactionViewModalComponent(props) {
  const [isShow, setIsShow] = useState(true)
  const [menu, setMenu] = useState('main')
  const { transaction, getAllTransaction, transactionItems} = props.transactionController
  const { setModal } = props
  const dispatch = useDispatch();

  const handleShow = () => {
    setIsShow(!isShow)
    setModal("")
  };

  const handleModalUpdate = () => {
    setModal("updateModal")
  }

  const handleModalDelete = () => {
    const transactionService = new TransactionService()
    const request: DeleteOneByIdRequest = {
      id: transaction.id
    }
    transactionService
      .deleteOneById(request)
      .then(() => {
        handleShow()
        const messageModalState: MessageModalState = {
          title: "Status",
          type: "success",
          content: "Delete Transaction Success",
          isShow: true
        }
        dispatch(message_modal_slice.actions.configure(messageModalState))
        getAllTransaction()
      })
  }

  return (
    <Modal
      show={isShow}
      onHide={handleShow}
      centered
      className="component product-view-modal"
    >
      <Modal.Header closeButton className="header">
        <Modal.Title>Item Transaction Details</Modal.Title>
      </Modal.Header>

      <Modal.Body className="body">
        {
          // Menu switch.
          {
            main: (
              <MainComponent
                transaction={transaction}
                transactionItems={transactionItems}
              />
            ),
          }[menu]
        }
      </Modal.Body>

      <Modal.Footer className="footer">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleModalUpdate}
        >
          Update Transaction
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleModalDelete}
        >
          Delete Transaction
        </button>
      </Modal.Footer>
    </Modal>
  );
}
