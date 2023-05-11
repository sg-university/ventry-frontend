import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Modal, Nav } from "react-bootstrap";
import * as Yup from "yup";
import pageSlice, {PageState} from "@/slices/page_slice";
import {useDispatch, useSelector} from "react-redux";
import ProductCardImage from "../../assets/images/product-management-card-img.svg";
import "@/styles/components/managements/histories/transactions/transaction_insert_modal.scss"
import { AxiosResponse } from "axios";
import Content from "@/models/value_objects/contracts/content";
import messageModalSlice, {MessageModalState} from "@/slices/message_modal_slice";
import TransactionService from "@/services/transaction_service";
import CreateOneTransactionRequest from "@/models/value_objects/contracts/requests/managements/transactions/create_one_request";
import CreateOneTransactionItemRequest from "@/models/value_objects/contracts/requests/managements/transaction_item_maps/create_one_request";
import Transaction from "@/models/entities/transaction";
import TransactionItemMapService from "@/services/transaction_item_map_service";

const insertSchema = Yup.object().shape({
  quantity: Yup.number("Must be number")
    .required("Required")
    .min(1, "Min 1"),
});

function MainComponent(props) {
  const { getAllTransaction, getAllTransactionItems, handleShow } = props
  const [selectedItem, setSelectedItem] = useState([] as Object[])
  const pageState: PageState = useSelector((state: any) => state.page);
  const dispatch = useDispatch();
  const { account } = pageState.accountManagement

  const handleClickSelect = (item, quantity) => {
    if(!selectedItem.some(i => i.item.id === item.id)) {
      setSelectedItem([...selectedItem, {item, quantity}])  
    }
  };

  const handleClickDelete = (val) => {
    setSelectedItem(selectedItem.filter(i => i.item.name != val.item.name))
  };

  const calculateTransaction = async () => {
    let totalPrice = 0
    selectedItem.forEach(i => {
      totalPrice = totalPrice + (i.item.unitSellPrice*i.quantity)
    });

    return totalPrice
  }

  const createTransactionItem = async (transactionId: any) => {
    const transcationItemService = new TransactionItemMapService()
    selectedItem.forEach(i => {
      const request: CreateOneTransactionItemRequest = {
        body: {
          transactionId,
          itemId: i.item.id,
          sellPrice: i.item.unitSellPrice,
          quantity: i.quantity
        }
      }
      transcationItemService
        .createOne(request)
        .then(() => {
          getAllTransactionItems()
        })
        .catch((error) => {
            console.log(error)
            const messageModalState: MessageModalState = {
                title: "Status",
                content: error.message,
                isShow: true
            }
            dispatch(messageModalSlice.actions.configure(messageModalState))
        });
    });
  }

  const handleInsertSubmit = async (values: any, actions: any) => {
    const date = new Date()
    const totalPrice = await calculateTransaction()
    const transactionService = new TransactionService()
    const request: CreateOneTransactionRequest = {
      body: {
        accountId: account.id,
        sellPrice: totalPrice,
        timestamp: date.toISOString()
      }
    }
    transactionService  
      .createOne(request)
      .then(async (result: AxiosResponse<Content<Transaction>>) => {
        const content = result.data;
        await createTransactionItem(content.data.id)
        getAllTransaction()
      })
      .catch((error) => {
          console.log(error)
          const messageModalState: MessageModalState = {
              title: "Status",
              content: error.message,
              isShow: true
          }
          dispatch(messageModalSlice.actions.configure(messageModalState))
      })
      .finally(() => {
        actions.setSubmitting(false);
        handleShow()
      });
  }
  
  return (
    <div className="main ">
      <div className="form">
        <Formik
          validationSchema={insertSchema}
          initialValues={{
            quantity: 0,
          }}
          onSubmit={handleInsertSubmit}
          enableReinitialize
        >
          {(props) => (
            <Form>
              <div className="column">
                <div className="table-p">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Code</th>
                        <th scope="col">Name</th>
                        <th scope="col">Price</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageState.itemManagement.items.map((val, idx) => {
                        return (
                          <tr key={idx}>
                            <td>{val.code}</td>
                            <td>{val.name}</td>
                            <td>{val.unitSellPrice}</td>
                            <td><Field type="number" name="quantity" className="form-control"/></td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={() => handleClickSelect(val, props.values.quantity)}
                              >
                                Select
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="table-sp">
                  <table className="table ">
                    <thead>
                      <tr>
                        <th scope="col">Code</th>
                        <th scope="col">Name</th>
                        <th scope="col">Price</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedItem.map((val, idx) => {
                        return (
                          <tr key={idx}>
                            <td>{val.item.code}</td>
                            <td>{val.item.name}</td>
                            <td>{val.item.unitSellPrice}</td>
                            <td>{val.quantity}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={() => handleClickDelete(val)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <ErrorMessage
                  name="product_id"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="quantity">
                Total Item : {selectedItem.length}
              </div>
              <hr />
              <div className="button">
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Insert Transaction
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

function TransactionInsertModalComponent(props) {
  const [isShow, setIsShow] = React.useState(true)
  const { setModal } = props

  const handleShow = () => {
    setIsShow(!isShow)
    setModal("")
  };

  return (
    <Modal
      show={isShow}
      onHide={handleShow}
      centered
      className="component product-insert-modal"
    >
      <Modal.Header closeButton className="header">
        <Modal.Title>Insert Transaction History</Modal.Title>
      </Modal.Header>

      <Modal.Body className="body">
        <MainComponent
          getAllTransaction={props.getAllTransaction}
          getAllTransactionItems={props.getAllTransactionItems}
          handleShow={handleShow}
        />
      </Modal.Body>
    </Modal>
  );
}

export default TransactionInsertModalComponent;
