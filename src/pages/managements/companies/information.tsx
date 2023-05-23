import React, {useEffect} from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";

import {Nav} from "react-bootstrap";
import MessageModal from "@/components/message_modal";
import pageSlice, {PageState} from "@/slices/page_slice";
import {useDispatch, useSelector} from "react-redux";
import Authenticated from "@/layouts/authenticated";
import "@/styles/pages/managements/companies/information.scss"
import LocationService from "@/services/location_service";
import {AxiosResponse} from "axios";
import Content from "@/models/value_objects/contracts/content";
import Location from "@/models/entities/location";
import messageModalSlice from "@/slices/message_modal_slice";
import CompanyService from "@/services/company_service";
import Company from "@/models/entities/company";
import {PencilFill, Trash3Fill} from "react-bootstrap-icons";
import PatchOneByIdRequest
    from "@/models/value_objects/contracts/requests/managements/companies/patch_one_by_id_request";
import {AuthenticationState} from "@/slices/authentication_slice";
import LocationInsertModalComponent from "@/components/managements/locations/location_insert_modal";
import LocationUpdateModalComponent from "@/components/managements/locations/location_update_modal";

const updateSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
});


function InformationComponent() {
    const companyService = new CompanyService()
    const pageState: PageState = useSelector((state: any) => state.page);
    const authenticationState: AuthenticationState = useSelector((state: any) => state.authentication);
    const {currentAccount} = authenticationState
    const {currentCompany} = pageState.companyInformationManagement
    const dispatch = useDispatch();

    const fetchCurrentCompany = () => {
        companyService
            .readAllByAccountId({
                accountId: currentAccount?.id
            })
            .then((response) => {
                const content: Content<Company[]> = response.data;
                dispatch(pageSlice.actions.configureCompanyInformationManagement({
                    ...pageState.companyInformationManagement,
                    currentCompany: content.data[0],
                }))
            })
            .catch((error) => {
                console.log(error)
            });
    }

    useEffect(() => {
        fetchCurrentCompany()
    }, [])

    const handleSubmitUpdate = (values: any, actions: any) => {
        const request: PatchOneByIdRequest = {
            id: currentCompany?.id,
            body: {
                name: values.name,
                description: values.description,
                address: values.address
            }
        }
        companyService
            .patchOneById(request)
            .then((response) => {
                const content: Content<Company> = response.data;
                dispatch(messageModalSlice.actions.configure({
                    type: "succeed",
                    content: "Update Company Information succeed.",
                    isShow: true
                }))
                dispatch(pageSlice.actions.configureCompanyInformationManagement({
                    ...pageState.companyInformationManagement,
                    currentCompany: content.data
                }))
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
        <div className="form">
            <Formik
                validationSchema={updateSchema}
                initialValues={{
                    name: currentCompany?.name,
                    description: currentCompany?.description,
                    address: currentCompany?.address
                }}
                onSubmit={handleSubmitUpdate}
                enableReinitialize
            >
                {(props) => (
                    <Form>
                        <fieldset className="form-group">
                            <label htmlFor="name">Company Name</label>
                            <Field type="text" name="name" className="form-control mt-2"/>
                            <ErrorMessage name="name" component="div" className="text-danger"/>
                        </fieldset>
                        <fieldset className="form-group pt-3">
                            <label htmlFor="description">Company Description</label>
                            <Field
                                as="textarea"
                                type="text"
                                name="description"
                                className="form-control mt-2"
                            />
                            <ErrorMessage
                                name="description"
                                component="div"
                                className="text-danger"
                            />
                        </fieldset>
                        <fieldset className="form-group pt-3">
                            <label htmlFor="address">Company Address</label>
                            <Field
                                as="textarea"
                                type="text"
                                name="address"
                                className="form-control mt-2"
                            />
                            <ErrorMessage
                                name="address"
                                component="div"
                                className="text-danger"
                            />
                        </fieldset>
                        <button type="submit" className="btn btn-primary pt-2">
                            Update
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

function LocationComponent() {
    const locationService = new LocationService()
    const pageState: PageState = useSelector((state: any) => state.page);
    const {currentLocations, currentModal, currentCompany} = pageState.companyInformationManagement
    const dispatch = useDispatch();

    const fetchCurrentLocations = () => {
        locationService
            .readAllByCompanyId({
                companyId: currentCompany?.id
            })
            .then((result: AxiosResponse<Content<Location[]>>) => {
                const content = result.data;
                dispatch(pageSlice.actions.configureCompanyInformationManagement({
                    ...pageState.companyInformationManagement,
                    currentLocations: content.data
                }))
            })
            .catch((error) => {
                console.log(error)
            });
    }

    useEffect(() => {
        fetchCurrentLocations()
    }, [])


    const handleClickDeleteLocation = (location: Location) => {
        locationService
            .deleteOneById({
                id: location.id
            })
            .then((response) => {
                const content: Content<Location> = response.data;
                dispatch(pageSlice.actions.configureCompanyInformationManagement({
                    ...pageState.companyInformationManagement,
                    currentLocations: currentLocations?.filter((item) => item.id != location.id)
                }))
                dispatch(messageModalSlice.actions.configure({
                    type: "succeed",
                    content: "Delete Location succeed.",
                    isShow: true
                }))
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

    const handleClickModalUpdate = (location: Location) => {
        dispatch(pageSlice.actions.configureCompanyInformationManagement({
            ...pageState.companyInformationManagement,
            currentLocation: location,
            currentModal: 'updateModal',
            isShowModal: true
        }))
    }

    const handleClickModalInsert = () => {
        dispatch(pageSlice.actions.configureCompanyInformationManagement({
            ...pageState.companyInformationManagement,
            currentModal: 'insertModal',
            isShowModal: true
        }))
    }

    return (
        <div className="locations">
            <MessageModal/>
            {currentModal == 'insertModal' && <LocationInsertModalComponent/>}
            {currentModal == 'updateModal' && <LocationUpdateModalComponent/>}
            <div className="upper">
                Location List
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleClickModalInsert}
                >
                    Add
                </button>
            </div>
            <div className="lower">
                {currentLocations && currentLocations.map((value, index) => (
                    <div key={value.id} className="card">
                        <div className="content">
                            <div className="text">{value.name}</div>
                        </div>
                        <div className="control">
                            <PencilFill className="icon" onClick={() => handleClickModalUpdate(value)}/>
                            <Trash3Fill className="icon" onClick={() => handleClickDeleteLocation(value)}/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function Information() {
    const locationService = new LocationService();
    const companyService = new CompanyService();
    const pageState: PageState = useSelector((state: any) => state.page);
    const authenticationState: AuthenticationState = useSelector((state: any) => state.authentication);
    const {currentAccount} = authenticationState
    const {isShowModal, currentModalMenu, currentCompany} = pageState.companyInformationManagement
    const dispatch = useDispatch();


    const handleSelectMenu = (eventKey: any) => {
        dispatch(pageSlice.actions.configureCompanyInformationManagement({
            ...pageState.companyInformationManagement,
            currentModalMenu: eventKey
        }))
    }

    return (
        <Authenticated>
            <div className="page company-information">
                <MessageModal/>
                <div className="header">
                    <div className="left-section">
                        <div className="title">
                            <h1>Company Management</h1>
                        </div>
                        <div className="description">
                            <div className="text">
                                Company Information
                            </div>
                        </div>
                    </div>
                </div>
                <div className="body">
                    <Nav variant="tabs" onSelect={handleSelectMenu}>
                        <Nav.Item>
                            <Nav.Link eventKey="information"
                                      className={currentModalMenu == "information" ? "active" : "menu"}>Information</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="location"
                                      className={currentModalMenu == "location" ? "active" : "menu"}>Location</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    {
                        {
                            information: <InformationComponent/>,
                            location: <LocationComponent/>,
                        }[currentModalMenu || 'information']
                    }
                </div>
            </div>
        </Authenticated>
    );
}
