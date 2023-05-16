import React, {useEffect} from "react";
import {Modal} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";

import pageSlice, {PageState} from "@/slices/page_slice";
import "@/styles/components/managements/forecasts/transaction_view_modal.scss"
import AccountService from "@/services/account_service";
import CompanyService from "@/services/company_service";
import ItemService from "@/services/item_service";
import RoleService from "@/services/role_service";
import LocationService from "@/services/location_service";
import {AuthenticationState} from "@/slices/authentication_slice";
import {Field, Form, Formik} from "formik";
import ForecastService from "@/services/forecast_service";
import Content from "@/models/value_objects/contracts/content";
import TransactionForecastResponse
    from "@/models/value_objects/contracts/response/forecasts/item_transactions/transaction_forecast_response";
import {Line} from "react-chartjs-2";
import messageModalSlice from "@/slices/message_modal_slice";
import {ChartData, ChartOptions} from "chart.js";

export default function TransactionViewModalComponent() {
    const dispatch = useDispatch();
    const accountService: AccountService = new AccountService();
    const companyService: CompanyService = new CompanyService();
    const itemService: ItemService = new ItemService();
    const roleService: RoleService = new RoleService();
    const locationService: LocationService = new LocationService();
    const forecastService: ForecastService = new ForecastService();
    const authenticationState: AuthenticationState = useSelector((state: any) => state.authentication);
    const pageState: PageState = useSelector((state: any) => state.page);
    const {
        isShowModal,
        currentModal,
        items,
        currentItem,
        currentTransactionForecast,
    } = pageState.itemTransactionForecastManagement;

    useEffect(() => {
        dispatch(pageSlice.actions.configureItemTransactionForecastManagement({
            ...pageState.itemTransactionForecastManagement,
            currentTransactionForecast: undefined,
        }))
    }, [])


    const handleShowModal = () => {
        dispatch(pageSlice.actions.configureItemTransactionForecastManagement({
                ...pageState.itemTransactionForecastManagement,
                isShowModal: !pageState.itemTransactionForecastManagement.isShowModal,
            })
        )
    };

    const handleForecastSubmit = (values: any, forecast: any) => {
        forecastService.forecastTransactionByItemId({
            itemId: currentItem?.id,
            body: {
                resample: values.resample,
                horizon: values.horizon,
                testSize: values.testSize
            }
        }).then((response) => {
            const content: Content<TransactionForecastResponse> = response.data
            dispatch(pageSlice.actions.configureItemTransactionForecastManagement({
                ...pageState.itemTransactionForecastManagement,
                currentTransactionForecast: content.data,
            }))
        }).catch((error) => {
            dispatch(messageModalSlice.actions.configure({
                isShowModal: true,
                title: "Status",
                content: error.message,
                type: "failed",
            }))
        })
    }

    const pastLength = currentTransactionForecast?.prediction?.past?.length || 0
    const futureLength = currentTransactionForecast?.prediction?.future?.length || 0
    const lastPast = currentTransactionForecast?.prediction?.past?.slice(pastLength - 1, pastLength)?.pop()
    const firstFuture = currentTransactionForecast?.prediction?.future?.slice(0, 1)?.pop()

    const currentChartData: ChartData<"line"> = {
        labels: [
            ...(currentTransactionForecast?.prediction?.past || []).map(value => value.timestamp),
            ...(currentTransactionForecast?.prediction?.future || []).map(value => value.timestamp)
        ],
        datasets: [
            {
                label: "Past",
                data: (currentTransactionForecast?.prediction?.past || []).map(value => {
                    return {
                        x: new Date(value.timestamp!).getTime(),
                        y: value.quantity!
                    }
                })
            },
            {
                label: "Future",
                data: (currentTransactionForecast?.prediction?.future || []).map(value => {
                    return {
                        x: new Date(value.timestamp!).getTime(),
                        y: value.quantity!
                    }
                })
            },
            {
                label: "Interpolation",
                data: [
                    {
                        x: new Date(lastPast?.timestamp!).getTime(),
                        y: lastPast?.quantity!
                    },
                    {
                        x: new Date(firstFuture?.timestamp!).getTime(),
                        y: firstFuture?.quantity!
                    }
                ]
            },
        ],
    }

    const currentChartOptions: ChartOptions<"line"> = {
        scales: {
            x:
                {
                    type: "time",
                    ticks: {
                        display: true,
                    },
                },
            y:
                {
                    ticks: {
                        display: true,
                    },
                },
        },
    }

    return (
        <Modal
            show={isShowModal}
            onHide={() => handleShowModal()}
            centered
            className="component transaction-forecast-view-modal"
            size="lg"
        >
            <Modal.Header closeButton className="header">
                <Modal.Title>Item Transaction Forecast Details</Modal.Title>
            </Modal.Header>

            <Modal.Body className="body">
                <div className="options">
                    <Formik
                        initialValues={{
                            resample: "D",
                            horizon: 1,
                            testSize: 0.2
                        }}
                        onSubmit={handleForecastSubmit}
                        enableReinitialize
                    >
                        {(props) => (
                            <Form>
                                <fieldset className="form-group">
                                    <label htmlFor="resample">Resample</label>
                                    <Field
                                        className="form-control"
                                        type="text"
                                        name="resample"
                                    />
                                </fieldset>
                                <fieldset className="form-group">
                                    <label htmlFor="horizon">Horizon</label>
                                    <Field
                                        className="form-control"
                                        type="number"
                                        name="horizon"
                                    />
                                </fieldset>
                                <fieldset className="form-group">
                                    <label htmlFor="testSize">Test Size</label>
                                    <Field
                                        className="form-control"
                                        type="number"
                                        name="testSize"
                                    />
                                </fieldset>
                                <button type="submit" className="btn btn-outline-primary">
                                    Forecast
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="sub">
                    <div className="graph">
                        <Line data={currentChartData} options={currentChartOptions}></Line>
                    </div>
                </div>
                <div className="metrics">
                    <div className="mae">MAE: {currentTransactionForecast?.metric?.mae}</div>
                    <div className="smape">SMAPE: {currentTransactionForecast?.metric?.smape}</div>
                </div>
            </Modal.Body>

            <Modal.Footer className="footer d-none">
                <button type="button" className="btn btn-primary ">
                    Action
                </button>
            </Modal.Footer>
        </Modal>
    );
}
