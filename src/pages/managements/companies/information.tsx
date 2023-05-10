import React, { useEffect, useState } from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";

import { Nav } from "react-bootstrap";
import MessageModal from "@/components/message_modal";
import pageSlice, {PageState} from "@/slices/page_slice";
import {useDispatch, useSelector} from "react-redux";
import Authenticated from "@/layouts/authenticated";
import "@/styles/pages/managements/companies/information.scss"
import LocationService from "@/services/location_service";
import { AxiosResponse } from "axios";
import Content from "@/models/value_objects/contracts/content";
import Location from "@/models/entities/location";
import message_modal_slice, { MessageModalState } from "@/slices/message_modal_slice";
import CompanyService from "@/services/company_service";
import ReadOneLocationByIdRequest from "@/models/value_objects/contracts/requests/managements/locations/read_one_by_id_request";
import ReadOneCompanyByIdRequest from "@/models/value_objects/contracts/requests/managements/companies/read_one_by_id_request";
import Company from "@/models/entities/company";
import { PencilFill, Trash3Fill } from "react-bootstrap-icons";
import PatchOneByIdRequest from "@/models/value_objects/contracts/requests/managements/companies/patch_one_by_id_request";
import DeleteOneByIdRequest from "@/models/value_objects/contracts/requests/managements/locations/delete_one_by_id_request";
import LocationInsertModalComponent from "@/components/location/location_insert_modal";
import LocationUpdateModalComponent from "@/components/location/location_update_modal";

const updateSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  address: Yup.string().required("Required"),
});


function InformationComponent(props) {
  const pageState: PageState = useSelector((state: any) => state.page);
  const { company, setCompany } = props
  const dispatch = useDispatch();

  const handleSubmitUpdate = (values: any, actions: any) => {
    const companyService = new CompanyService()
    const request: PatchOneByIdRequest = {
      id: company.id,
      body: {
        name: values.name,
        description: values.description,
        address: values.address
      }
    }
    companyService
      .patchOneById(request)
      .then((result: AxiosResponse<Content<Company>>) => {
        const content = result.data;
        setCompany(content.data)
      })
      .catch((error) => {
          console.log(error)
          const messageModalState: MessageModalState = {
              title: "Status",
              content: error.message,
              isShow: true
          }
          dispatch(message_modal_slice.actions.configure(messageModalState))
      });
  }

  return (
    <div className="form">
      <Formik
        validationSchema={updateSchema}
        initialValues={{
          name: company.name, 
          description: company.description,
          address: company.address
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
              Update Data
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

function LocationComponent(props) {
  const pageState: PageState = useSelector((state: any) => state.page);
  const { getAllLocations, company } = props
  const [modal, setModal] = useState("")
  const [location, setLocation] = useState({})
  const dispatch = useDispatch();

  const handleModalInsert = () => {
    setModal("insertModal")
  }

  const handleModalUpdate = (location: Location) => {
    setLocation(location)
    setModal("updateModal")
  }

  const handleDeleteLocation = (location: Location) => {
    const locationService = new LocationService()
    const request: DeleteOneByIdRequest = {
      id: location.id
    }
    locationService
      .deleteOneById(request)
      .then((result: AxiosResponse<Content<Location>>) => {
        const content = result.data;
        getAllLocations()
      })
      .catch((error) => {
          console.log(error)
          const messageModalState: MessageModalState = {
              title: "Status",
              content: error.message,
              isShow: true
          }
          dispatch(message_modal_slice.actions.configure(messageModalState))
      });
  }

  return (
    <div className="locations">
      <MessageModal/>
      {modal == 'insertModal' && <LocationInsertModalComponent setModal={setModal} company={company} getAllLocations={getAllLocations}/>}
      {modal == 'updateModal' && <LocationUpdateModalComponent setModal={setModal} location={location} getAllLocations={getAllLocations}/>}
      <div className="upper">
        Location List
        <button 
          type="button"   
          className="btn btn-primary"
          onClick={handleModalInsert}
        >
          Add Location
        </button>
      </div>
      <div className="lower">
        {pageState.locationManagement.locations.map((val, idx) => (
          <div key={val.id} className="card">
            <div className="content">
              <div className="text">{val.name}</div>
            </div>
            <div className="control">
              <PencilFill className="icon" onClick={() => handleModalUpdate(val)}/>
              <Trash3Fill className="icon" onClick={() => handleDeleteLocation(val)}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Information() {
    const pageState: PageState = useSelector((state: any) => state.page);
    const { account } = pageState.accountManagement
    const [company, setCompany] = useState({})
    const [menu, setMenu] = React.useState('information')
    const dispatch = useDispatch();
    
    const getLocation = async () => {
      const locationService = new LocationService();
      const request: ReadOneLocationByIdRequest = {
        id: account.locationId
      }
      locationService
        .readOneById(request)
        .then((result: AxiosResponse<Content<Location>>) => {
            const content = result.data;
            getCompany(content.data.companyId)
          })
          .catch((error) => {
              console.log(error)
              const messageModalState: MessageModalState = {
                  title: "Status",
                  content: error.message,
                  isShow: true
              }
              dispatch(message_modal_slice.actions.configure(messageModalState))
          });
    }

    const getCompany = (companyId) => {
      const companyService = new CompanyService();
      const request: ReadOneCompanyByIdRequest = {
        id: companyId
      }
      companyService
        .readOneById(request)
        .then((result: AxiosResponse<Content<Company>>) => {
            const content = result.data;
            setCompany(content.data)
          })
          .catch((error) => {
              console.log(error)
              const messageModalState: MessageModalState = {
                  title: "Status",
                  content: error.message,
                  isShow: true
              }
              dispatch(message_modal_slice.actions.configure(messageModalState))
          });
    }

    const getAllLocations = () => {
      const locationService = new LocationService()
      locationService
        .readAll()
        .then((result: AxiosResponse<Content<Location[]>>) => {
          const content = result.data;
          dispatch(pageSlice.actions.configureLocationManagement({
              ...pageState.locationManagement,
              locations: content.data
          }))
      })
      .catch((error) => {
          console.log(error)
          const messageModalState: MessageModalState = {
              title: "Status",
              content: error.message,
              isShow: true
          }
          dispatch(message_modal_slice.actions.configure(messageModalState))
      });

    }

    useEffect(() => {
      getLocation()
      getAllLocations()
    }, [])

    const handleSelectMenu = (eventKey, e) => {
      setMenu(eventKey)
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
              <Nav.Link eventKey="information" className={menu == "information" ? "active" : "menu"}>Information</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="location" className={menu == "location" ? "active" : "menu"}>Location</Nav.Link>
            </Nav.Item>
          </Nav>
           {
              // Menu switch.
              {
                information: (
                  <InformationComponent
                    company={company}
                    setCompany={setCompany}
                  />
                ),
                location: (
                  <LocationComponent
                    company={company}
                    getAllLocations={getAllLocations}
                  />
                ),
              }[menu]
            }
        </div>
      </div>
      </Authenticated>
    );
}
