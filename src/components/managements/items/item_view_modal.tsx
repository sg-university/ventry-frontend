import React, {useEffect} from "react";
import {Modal, Nav} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import pageSlice, {PageState} from "@/slices/page_slice";
import ItemBundleMap from "@/models/entities/item_bundle_map";
import Content from "@/models/value_objects/contracts/content";
import messageModalSlice from "@/slices/message_modal_slice";
import Image from "next/image";
import ItemCardImage from "@/assets/images/item_management_card.svg";
import "@/styles/components/managements/items/item_view_modal.scss";
import ItemService from "@/services/item_service";
import Item from "@/models/entities/item";
import ItemBundleMapService from "@/services/item_bundle_map_service";
import LocationService from "@/services/location_service";
import Location from "@/models/entities/location";

function MainComponent() {
    const locationService: LocationService = new LocationService();
    const itemService: ItemService = new ItemService()
    const pageState: PageState = useSelector((state: any) => state.page);
<<<<<<< HEAD:src/components/managements/items/item_view_modal.tsx
    const {
        currentItem,
        currentLocation,
    } = pageState.itemManagement;
    const {currentAccount} = pageState.accountManagement
=======
    const { currentItem } = pageState.itemManagement;
    const { currentLocation } = pageState.locationManagement
    const { account } = pageState.accountManagement
>>>>>>> main:src/components/item_management/item_view_modal.tsx
    const dispatch = useDispatch();

    useEffect(() => {
        fetchCurrentLocation()
    }, [])

    const fetchCurrentLocation = () => {
        locationService.readAllByItemId({
            itemId: currentItem?.id
        }).then((response) => {
            const content: Content<Location[]> = response.data;
            dispatch(pageSlice.actions.configureLocationManagement({
                ...pageState.locationManagement,
                location: content.data[0]
            }))
        }).catch((error) => {
            console.log(error)
        })
    }

    const fetchItemsByLocation = () => {
<<<<<<< HEAD:src/components/managements/items/item_view_modal.tsx
        itemService.readAllByLocationId({
            locationId: currentAccount?.locationId
        }).then((response) => {
            const content: Content<Item[]> = response.data;
            dispatch(pageSlice.actions.configureItemManagement({
                ...pageState.itemManagement,
                items: content.data,
            }))
        }).catch((error) => {
            console.log(error);
        })
=======
      itemService.readAllByLocationId({
          locationId: account?.locationId
      }).then((response) => {
          const content: Content<Item[]> = response.data;
          dispatch(pageSlice.actions.configureItemManagement({
              ...pageState.itemManagement,
              items: content.data,
              currentModal: "noModal",
              isShowModal: false
          }))
      }).catch((error) => {
          console.log(error);
      })
>>>>>>> main:src/components/item_management/item_view_modal.tsx
    }

    const handleModalUpdate = () => {
        dispatch(pageSlice.actions.configureItemManagement({
                ...pageState.itemManagement,
                currentModal: "updateModal",
                isShowModal: true
            })
        )
    }

    const handleModalDelete = () => {
        itemService
            .deleteOneById({
                id: currentItem?.id
            })
<<<<<<< HEAD:src/components/managements/items/item_view_modal.tsx
            .then((response) => {
                dispatch(pageSlice.actions.configureItemManagement({
                        ...pageState.itemManagement,
                        currentModal: "noModal",
                        isShowModal: !pageState.itemManagement.isShowModal,
                    })
                )
                const content: Content<Item> = response.data;
                dispatch(messageModalSlice.actions.configure({
                    type: "succeed",
                    content: content.message,
                    isShow: true
                }))
                fetchItemsByLocation()
=======
            .then(() => {
                fetchItemsByLocation()
                const messageModalState: MessageModalState = {
                    title: "Status",
                    type: "success",
                    content: "Success Delete Item",
                    isShow: true
                }
                dispatch(message_modal_slice.actions.configure(messageModalState))
>>>>>>> main:src/components/item_management/item_view_modal.tsx
            })
            .catch((error) => {
                console.log(error)
                dispatch(messageModalSlice.actions.configure({
                    type: "failed",
                    content: error.message,
                    isShow: true
                }))
            });
    }
    return (
        <div className="main">
            <div className="id">
                <div className="text">{`Item Id: ${currentItem?.id}`}</div>
            </div>
            <div className="location">
                <div className="text">{`Location: ${currentLocation?.name}`}</div>
            </div>
            <div className="name">
                <div className="text">{`Name: ${currentItem?.name}`}</div>
            </div>
            <div className="type">
                <div className="text">{`Type: ${currentItem?.type}`}</div>
            </div>
            <div className="quantity">
                <div className="text">
                    {`Available Quantity: ${currentItem?.quantity}`}
                </div>
            </div>
            <div className="unit-type">
                <div className="text">{`Unit Type: ${currentItem?.unitName}`}</div>
            </div>
            <div className="unit-cost-price">
                <div className="text">
                    {`Unit Cost Price: ${currentItem?.unitCostPrice}`}
                </div>
            </div>
            <div className="unit-sell-price">
                <div className="text">
                    {`Unit Sell Price: ${currentItem?.unitSellPrice}`}
                </div>
            </div>
            <div className="description">
                <div className="text">{`Description: ${currentItem?.description}`}</div>
            </div>
            <div className="image">
                Image:{" "}
                <Image
                    src={ItemCardImage}
                    alt="item"
                />
            </div>
            <hr/>
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

function ItemBundleComponent() {
    const itemBundleMapService: ItemBundleMapService = new ItemBundleMapService();
    const pageState: PageState = useSelector((state: any) => state.page);
    const {
        items,
        currentItem,
        currentItemBundleMaps,
    } = pageState.itemManagement;
    const dispatch = useDispatch();

    useEffect(() => {
        fetchCurrentItemBundleMaps()
    }, [])

    const fetchCurrentItemBundleMaps = () => {
        itemBundleMapService.readAllBySuperItemId({
            superItemId: currentItem?.id
        }).then((response) => {
            const content: Content<ItemBundleMap[]> = response.data;
            dispatch(pageSlice.actions.configureItemManagement({
                ...pageState.itemManagement,
                currentItemBundleMaps: content.data
            }))
        }).catch((error) => {
            console.log(error)
        })
    }

    const handleModalUpdate = () => {
      dispatch(pageSlice.actions.configureItemManagement({
          ...pageState.itemManagement,
          currentModal: "updateModal"
      }))
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
                    {currentItemBundleMaps && currentItemBundleMaps.map((value, index) => {
                        return (
                            <tr key={value.id}>
                                <td>{value.subItemId}</td>
                                <td>{items?.find(item => item.id == value.subItemId)?.name}</td>
                                <td>{value.quantity}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
            <hr/>
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

export default function ItemViewModalComponent() {
    const itemBundleMapService: ItemBundleMapService = new ItemBundleMapService()
    const pageState: PageState = useSelector((state: any) => state.page);
    const {
<<<<<<< HEAD:src/components/managements/items/item_view_modal.tsx
        isShowModal,
        currentItem,
        currentModalMenu
=======
      isShowModal,
      currentItem,
      menu,
>>>>>>> main:src/components/item_management/item_view_modal.tsx
    } = pageState.itemManagement;
    const dispatch = useDispatch();

    const handleShowModal = () => {
<<<<<<< HEAD:src/components/managements/items/item_view_modal.tsx
        dispatch(pageSlice.actions.configureItemManagement({
                ...pageState.itemManagement,
                isShowModal: !pageState.itemManagement.isShowModal,
            })
        )
=======
      dispatch(pageSlice.actions.configureItemManagement({
        ...pageState.itemManagement,
        isShowModal: !pageState.itemManagement.isShowModal,
      }))
>>>>>>> main:src/components/item_management/item_view_modal.tsx
    };

    useEffect(() => {
        fetchItemBundles()
    }, [])

    const fetchItemBundles = () => {
        itemBundleMapService
            .readAllBySuperItemId({
                superItemId: currentItem?.id
            })
            .then((response) => {
                const content: Content<ItemBundleMap[]> = response.data;
            })
            .catch((error) => {
                console.log(error)
            });
    }

    const handleSelectModalMenu = (eventKey: string | null) => {
      dispatch(pageSlice.actions.configureItemManagement({
        ...pageState.itemManagement,
        menu: eventKey
      }))
    }

    return (
        <Modal
            show={isShowModal}
            onHide={() => handleShowModal()}
            centered
            className="component item-view-modal"
        >
            <Modal.Header closeButton className="header">
                <Modal.Title>Item Details</Modal.Title>
            </Modal.Header>

            <Nav variant="tabs" onSelect={(eventKey) => handleSelectModalMenu(eventKey)}>
                <Nav.Item>
                    <Nav.Link eventKey="main" className={menu == "main" ? "active" : "menu"}>Main</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="itemBundle" className={menu == "itemBundle" ? "active" : "menu"}>Items
                        Bundle</Nav.Link>
                </Nav.Item>
            </Nav>

            <Modal.Body className="body">
              {
                {
                  main: <MainComponent/>,
                  itemBundle: <ItemBundleComponent/>,
                }[menu || "main"]
              }
            </Modal.Body>
        </Modal>
    );
}
