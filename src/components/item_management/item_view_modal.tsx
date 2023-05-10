import React, { useEffect } from "react";
import { Modal, Nav } from "react-bootstrap";
import {useDispatch,useSelector} from "react-redux";
import {PageState} from "@/slices/page_slice";
import ItemBundleMap from "@/models/entities/item_bundle_map";
import ItemBundleService from "@/services/item_bundle_map_service";
import {AxiosResponse} from "axios";
import Content from "@/models/value_objects/contracts/content";
import messageModalSlice, {MessageModalState} from "@/slices/message_modal_slice";
import Image from "next/image";
import ItemCardImage from "@/assets/images/item_management_card.svg";
import "@/styles/components/item_management/item_view_modal.scss";
import ItemService from "@/services/item_service";
import DeleteOneByIdRequest from "@/models/value_objects/contracts/requests/managements/items/delete_one_by_id_request";

function MainComponent(props) {
  const pageState: PageState = useSelector((state: any) => state.page);
  const { item, setModal, handleShow, getAllItems } = props
  const locations = pageState.locationManagement.locations
  const location = locations.find(l => l.id == item.locationId)
  const dispatch = useDispatch();

  const handleModalUpdate = () => {
    setModal("updateModal")
  }

  const handleModalDelete = () => {
    const itemService = new ItemService()
    const request: DeleteOneByIdRequest = {
      id: item.id
    }
    itemService
      .deleteOneById(request)
      .then(() => {
        handleShow()
        const messageModalState: MessageModalState = {
            title: "Status",
            type: "success",
            content: "Delete Item Success",
            isShow: true
        }
        dispatch(messageModalSlice.actions.configure(messageModalState))
        getAllItems()
      })
  }

  return (
    <div className="main">
      <div className="id">
        <div className="text">{`Item Id: ${item.id}`}</div>
      </div>
      <div className="location">
        <div className="text">{`Location: ${location.name}`}</div>
      </div>
      <div className="name">
        <div className="text">{`Name: ${item.name}`}</div>
      </div>
      <div className="type">
        <div className="text">{`Type: ${item.type}`}</div>
      </div>
      <div className="quantity">
        <div className="text">
          {`Available Quantity: ${item.quantity}`}
        </div>
      </div>
      <div className="unit-type">
        <div className="text">{`Unit Type: ${item.unitName}`}</div>
      </div>
      <div className="unit-cost-price">
        <div className="text">
          {`Unit Cost Price: ${item.unitCostPrice}`}
        </div>
      </div>
      <div className="description">
        <div className="text">{`Description: ${item.description}`}</div>
      </div>
      <div className="image">
        Image:{" "}
        <Image
          src={item.image_url || ItemCardImage}
          onError={(e) => {
            e.target.src = ItemCardImage;
          }}
          alt="item"
        />
      </div>
      <hr />
      <div className="button">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => handleModalUpdate()}
        >
          Update Item
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => handleModalDelete()}
        >
          Delete Item
        </button>
      </div>
    </div>
  );
}

function ItemsComponent(props) {
  const pageState: PageState = useSelector((state: any) => state.page);
  const items = pageState.itemManagement.items
  const subItems = props.itemBundles.filter((itm) => itm.superItemId === props.item.id)
  const subItemsData = subItems.map(item1 => ({subItem:items.find(item2 => item2.id === item1.subItemId), ...item1}))

  const handleModalUpdate = () => {
    props.setModal("updateModal")
  }

  return (
    <div className="bundle">
      <div className="table-ic">
        <table className="table ">
          <thead>
            <tr>
              <th scope="col">Child Item ID</th>
              <th scope="col">Name</th>
              <th scope="col">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {subItemsData.map((val, idx) => {
              return (
                <tr key={idx}>
                  <td>{val.subItemId}</td>
                  <td>{val.subItem.name}</td>
                  <td>{val.quantity}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <hr />
      <div className="button">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => handleModalUpdate()}
        >
          Update Item Bundle
        </button>
      </div>
    </div>
  );
}

export default function ItemViewModalComponent(props) {
  const [isShow, setIsShow] = React.useState(true)
  const [menu, setMenu] = React.useState('main')
  const [itemBundles, setItemBundles] = React.useState([] as object[])
  const { item, setModal, getAllItems } = props
  const dispatch = useDispatch();

  useEffect(() => {
      const itemBundleService = new ItemBundleService();
      itemBundleService
        .readAll()
        .then((result: AxiosResponse<Content<ItemBundleMap[]>>) => {
              const { data } = result.data;
              setItemBundles(data)
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
  }, [])

  const handleShow = () => {
    setIsShow(!isShow)
    setModal("")
  }

  const handleSelectMenu = (eventKey, e) => {
    setMenu(eventKey)
  }

  return (
    <Modal
      show={isShow}
      onHide={handleShow}
      centered
      className="component item-view-modal"
    >
      <Modal.Header closeButton className="header">
        <Modal.Title>Item Details</Modal.Title>
      </Modal.Header>

      <Nav variant="tabs" onSelect={handleSelectMenu}>
        <Nav.Item>
          <Nav.Link eventKey="main" className={menu == "main" ? "active" : "menu"}>Main</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="items" className={menu == "items" ? "active" : "menu"}>Items Bundle</Nav.Link>
        </Nav.Item>
      </Nav>

      <Modal.Body className="body">
        {
          // Menu switch.
          {
            main: (
              <MainComponent
                parent={this}
                item={item}
                setModal={setModal}
                handleShow={handleShow}
                getAllItems={getAllItems}
              />
            ),
            items: (
              <ItemsComponent
                parent={this}
                item={item}
                itemBundles={itemBundles}
                setModal={setModal}
              />
            ),
          }[menu]
        }
      </Modal.Body>
    </Modal>
  );
}
