import React, {useState} from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Modal} from "react-bootstrap";
import * as Yup from "yup";
import pageSlice, {PageState} from "@/slices/page_slice";
import {useDispatch, useSelector} from "react-redux";
import "@/styles/components/managements/histories/transactions/transaction_insert_modal.scss"
import Content from "@/models/value_objects/contracts/content";
import messageModalSlice, { MessageModalState } from "@/slices/message_modal_slice";
import TransactionService from "@/services/transaction_service";
import CreateOneTransactionRequest
    from "@/models/value_objects/contracts/requests/managements/transactions/create_one_request";
import CreateOneTransactionItemRequest
    from "@/models/value_objects/contracts/requests/managements/transaction_item_maps/create_one_request";
import Transaction from "@/models/entities/transaction";
import TransactionItemMapService from "@/services/transaction_item_map_service";
import { AxiosResponse } from "axios";
import TransactionItemMap from "@/models/entities/transaction_item_map";

const insertSchema = Yup.object().shape({
    quantity: Yup.number()
        .required("Required")
        .min(1, "Min 1"),
});

function TransactionInsertModalComponent() {
    const transactionService = new TransactionService();
    const transcationItemService = new TransactionItemMapService()
    const pageState: PageState = useSelector((state: any) => state.page);
    const [selectedItem, setSelectedItem] = useState([] as Object[])
    const { items } = pageState.itemManagement
    const { isShowModal } = pageState.transactionManagement
    const { currentAccount } = pageState.accountManagement
    const dispatch = useDispatch();

    const getAllTransaction = () => {
        transactionService
            .readAll()
            .then((result: AxiosResponse<Content<Transaction[]>>) => {
                  const transactions = result.data;
                  getAllTransactionItems(transactions.data)
              })
              .catch((error) => {
                  console.log(error)
              });
    }
  
    const getAllTransactionItems = (transactions: Transaction[]) => {
        transcationItemService
            .readAll()
            .then((result: AxiosResponse<Content<TransactionItemMap[]>>) => {
                  const transactionItems = result.data;
                  dispatch(pageSlice.actions.configureTransactionManagement({
                      ...pageState.transactionManagement,
                      transactions: transactions,
                      transactionItems: transactionItems.data,
                      currentModal: "noModal",
                      isShowModal: false
                  })) 
              })
              .catch((error) => {
                  console.log(error)
              });
    }
  
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
        selectedItem.forEach((i, idx) => {
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
            if(idx == selectedItem.length - 1) getAllTransactionItems()
        });
    }
  
    const handleInsertSubmit = async (values: any, actions: any) => {
        const date = new Date()
        const totalPrice = await calculateTransaction()
        const transactionService = new TransactionService()
        const request: CreateOneTransactionRequest = {
            body: {
                accountId: currentAccount?.id,
                sellPrice: totalPrice,
                timestamp: date.toISOString()
            }
        }
        transactionService  
          .createOne(request)
          .then(async (result: AxiosResponse<Content<Transaction>>) => {
              const content = result.data;
              await createTransactionItem(content.data.id)
              const messageModalState: MessageModalState = {
                  title: "Status",
                  type: "succeed",
                  content: "Insert Transaction Succeed",
                  isShow: true
              }
              dispatch(messageModalSlice.actions.configure(messageModalState))
              getAllTransaction()
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
          })
          .finally(() => {
              actions.setSubmitting(false);
          });
    }
  
    const handleShowModal = () => {
        dispatch(pageSlice.actions.configureTransactionManagement({
            ...pageState.transactionManagement,
            currentModal: "noModal",
            isShowModal: false,
        }))
    }

    return (
        <Modal
            show={isShowModal}
            onHide={handleShowModal}
            centered
            className="component product-insert-modal"
        >
            <Modal.Header closeButton className="header">
                <Modal.Title>Insert Transaction History</Modal.Title>
            </Modal.Header>

            <Modal.Body className="body">
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
                                                    {items && items.map((val, idx) => {
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
            </Modal.Body>
        </Modal>
    );
}

export default TransactionInsertModalComponent;