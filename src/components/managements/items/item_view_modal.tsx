import React, {useEffect} from "react";
import {Modal, Nav} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import pageSlice, {PageState} from "@/slices/page_slice";
import ItemBundleMap from "@/models/entities/item_bundle_map";
import Content from "@/models/value_objects/contracts/content";
import message_modal_slice from "@/slices/message_modal_slice";
import Image from "next/image";
import ItemCardImage from "@/assets/images/item_management_card.svg";
import "@/styles/components/managements/items/item_view_modal.scss";
import ItemService from "@/services/item_service";
import Item from "@/models/entities/item";
import ItemBundleMapService from "@/services/item_bundle_map_service";
import LocationService from "@/services/location_service";
import Location from "@/models/entities/location";
import {AuthenticationState} from "@/slices/authentication_slice";
import confirmationModalSlice from "@/slices/confirmation_modal_slice";
import ImageUtility from "@/utilities/image_utility";

function MainComponent() {
    const imageUtility: ImageUtility = new ImageUtility()
    const locationService: LocationService = new LocationService();
    const itemService: ItemService = new ItemService()
    const itemBundleMapService: ItemBundleMapService = new ItemBundleMapService()
    const pageState: PageState = useSelector((state: any) => state.page);
    const {currentLocation, currentItem, isShowModal} = pageState.itemManagement
    const authenticationState: AuthenticationState = useSelector((state: any) => state.authentication);
    const {currentAccount} = authenticationState
    const dispatch = useDispatch();

    useEffect(() => {
        fetchCurrentLocation()
    }, [])

    const fetchCurrentItemBundleMaps = (location: Location) => {
        itemBundleMapService.readAllBySuperItemId({superItemId: currentItem?.id}).then((response) => {
            const content: Content<ItemBundleMap[]> = response.data;
            dispatch(pageSlice.actions.configureItemManagement({
                ...pageState.itemManagement,
                currentItemBundleMaps: content.data,
                currentLocation: location
            }))
        }).catch((error) => {
            console.log(error)
        })
    }

    const fetchCurrentLocation = () => {
        locationService.readAllByItemId({itemId: currentItem?.id})
            .then((response) => {
                const content: Content<Location[]> = response.data;
                fetchCurrentItemBundleMaps(content.data[0])
            }).catch((error) => {
            console.log(error)
        })
    }
    const fetchItemsByLocation = () => {
        itemService.readAllByLocationId({locationId: currentAccount?.locationId}).then((response) => {
            const content: Content<Item[]> = response.data;
            dispatch(pageSlice.actions.configureItemManagement({
                ...pageState.itemManagement,
                items: content.data.sort((a, b) => {
                  return new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime()
                }),
                isShowModal: !isShowModal,
                currentModal: "noModal"
            }))
        }).catch((error) => {
            console.log(error);
        })
    }
    const handleModalUpdate = () => {
        dispatch(pageSlice.actions.configureItemManagement({
            ...pageState.itemManagement,
            currentModal: "updateModal",
            isShowModal: true
        }))
    }
    const handleModalDelete = () => {
        const callback = () => {
            itemService.deleteOneById({id: currentItem?.id}).then(() => {
                fetchItemsByLocation()
                dispatch(message_modal_slice.actions.configure({
                    type: "succeed",
                    content: "Delete Item succeed.",
                    isShow: true
                }))
            }).catch((error) => {
                console.log(error)
                dispatch(message_modal_slice.actions.configure({
                    type: "failed",
                    content: error.message,
                    isShow: true
                }))
            });
        }

        dispatch(confirmationModalSlice.actions.configure({
            content: "Are you sure want to delete this item?",
            isShow: true,
            callback: callback
        }))
    }
    return (<div className="main">
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
            <div className="text"> {`Available Quantity: ${currentItem?.quantity}`} </div>
        </div>
        <div className="unit-type">
            <div className="text">{`Unit Type: ${currentItem?.unitName}`}</div>
        </div>
        <div className="unit-cost-price">
            <div className="text"> {`Unit Cost Price: ${currentItem?.unitCostPrice}`} </div>
        </div>
        <div className="unit-sell-price">
            <div className="text"> {`Unit Sell Price: ${currentItem?.unitSellPrice}`} </div>
        </div>
        <div className="description">
            <div className="text">{`Description: ${currentItem?.description}`}</div>
        </div>
        <div className="image"> Image:
            <Image
                src={currentItem?.image ? imageUtility.blobToBase64AsData(currentItem?.image) : ItemCardImage}
                width={298}
                height={160}
                alt="item"
                className={"rounded-1"}
            />
        </div>
        <hr/>
        <div className="button">
            <button type="button" className="btn btn-primary" onClick={() => handleModalUpdate()}>Update</button>
            <button type="button" className="btn btn-danger" onClick={() => handleModalDelete()}>Delete</button>
        </div>
    </div>);
}

function ItemBundleComponent() {
    const itemBundleMapService: ItemBundleMapService = new ItemBundleMapService();
    const pageState: PageState = useSelector((state: any) => state.page);
    const {items, currentItem, currentItemBundleMaps,} = pageState.itemManagement;
    const dispatch = useDispatch();
    useEffect(() => {
        fetchCurrentItemBundleMaps()
    }, [])
    const fetchCurrentItemBundleMaps = () => {
        itemBundleMapService.readAllBySuperItemId({superItemId: currentItem?.id}).then((response) => {
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
        dispatch(pageSlice.actions.configureItemManagement({...pageState.itemManagement, currentModal: "updateModal"}))
    }
    return (<div className="bundle">
        <div className="table-ic">
            <table className="table ">
                <thead>
                <tr>
                    <th scope="col">Child Item ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Quantity</th>
                </tr>
                </thead>
                <tbody> {currentItemBundleMaps?.map((value, index) => {
                    return (<tr key={value.id}>
                        <td>{value.subItemId}</td>
                        <td>{items?.find(item => item.id == value.subItemId)?.name}</td>
                        <td>{value.quantity}</td>
                    </tr>);
                })} </tbody>
            </table>
        </div>
        <hr/>
        <div className="button">
            <button type="button" className="btn btn-primary" onClick={() => handleModalUpdate()}> Update Item Bundle
            </button>
        </div>
    </div>);
}

export default function ItemViewModalComponent() {
    const itemBundleMapService: ItemBundleMapService = new ItemBundleMapService()
    const pageState: PageState = useSelector((state: any) => state.page);
    const {isShowModal, currentItem, currentModalMenu,} = pageState.itemManagement;
    const dispatch = useDispatch();
    const handleShowModal = () => {
        dispatch(pageSlice.actions.configureItemManagement({
            ...pageState.itemManagement,
            isShowModal: !isShowModal,
            currentModal: "noModal"
        }))
    };
    useEffect(() => {
        fetchItemBundles()
    }, [])
    const fetchItemBundles = () => {
        itemBundleMapService.readAllBySuperItemId({superItemId: currentItem?.id}).then((response) => {
            const content: Content<ItemBundleMap[]> = response.data;
        }).catch((error) => {
            console.log(error)
        });
    }
    const handleSelectModalMenu = (eventKey: string | null) => {
        dispatch(pageSlice.actions.configureItemManagement({...pageState.itemManagement, currentModalMenu: eventKey}))
    }
    return (
        <Modal show={isShowModal} onHide={() => handleShowModal()} centered className="component item-view-modal">
            <Modal.Header closeButton className="header">
                <Modal.Title>Item Details</Modal.Title>
            </Modal.Header>
            <Nav variant="tabs" onSelect={(eventKey) => handleSelectModalMenu(eventKey)}>
                <Nav.Item>
                    <Nav.Link eventKey="main" className={currentModalMenu == "main" ? "active" : "menu"}>
                        Main
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="itemBundle" className={currentModalMenu == "itemBundle" ? "active" : "menu"}>
                        Items Bundle
                    </Nav.Link>
                </Nav.Item>
            </Nav>
            <Modal.Body className="body">
                {
                    {
                        main: <MainComponent/>,
                        itemBundle: <ItemBundleComponent/>,
                    }[currentModalMenu || "main"]
                }
            </Modal.Body>
        </Modal>
    );
}