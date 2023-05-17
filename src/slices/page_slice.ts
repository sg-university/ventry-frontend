import {createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from "next-redux-wrapper";
import Item from "@/models/entities/item";
import Account from "@/models/entities/account";
import Location from '@/models/entities/location';
import Company from "@/models/entities/company";
import Role from "@/models/entities/role";
import ItemBundleMap from "@/models/entities/item_bundle_map";
import TransactionForecastResponse
    from "@/models/value_objects/contracts/response/forecasts/item_transactions/transaction_forecast_response";
import StockForecastResponse
    from "@/models/value_objects/contracts/response/forecasts/item_stocks/stock_forecast_response";
import InventoryControl from "@/models/entities/inventory_control";
import TransactionItemMap from "@/models/entities/transaction_item_map";
import Transaction from "@/models/entities/transaction";


export interface ItemManagementState {
    items: Item[] | undefined
    currentItem: Item | undefined
    currentItemBundleMaps: ItemBundleMap[] | undefined
    currentItemBundle: ItemBundleMap | undefined
    currentLocation: Location | undefined
    currentModal: string | undefined
    isShowModal: boolean | undefined
    currentModalMenu: string | undefined
    currentAction: string | undefined
}

export interface AccountManagementState {
    currentAccount: Account | undefined
    currentRole: Role | undefined
    roles: Role[] | undefined
}

export interface LocationManagementState {
    locations: Location[] | undefined,
    currentLocation: Location | undefined
    currentModal: string | undefined
    isShowModal: boolean | undefined
}

export interface CompanyAccountManagementState {
    companyAccounts: Account[] | undefined
    companyLocations: Location[] | undefined
    roles: Role[] | undefined
    currentCompany: Company | undefined
    currentAccount: Account | undefined
    currentRole: Role | undefined
    currentLocation: Location | undefined
    currentModal: string | undefined
    isShowModal: boolean | undefined
}

export interface ItemStockForecastManagement {
    items: Item[] | undefined
    currentItem: Item | undefined
    currentStockForecast: StockForecastResponse | undefined
    currentModal: string | undefined
    isShowModal: boolean | undefined
    currentModalMenu: string | undefined
}

export interface ItemTransactionForecastManagement {
    items: Item[] | undefined
    currentItem: Item | undefined
    currentTransactionForecast: TransactionForecastResponse | undefined
    currentModal: string | undefined
    isShowModal: boolean | undefined
    currentModalMenu: string | undefined
}


export interface CompanyInformationManagementState {
    currentCompany: Company | undefined
    currentLocation: Location | undefined
    currentLocations: Location[] | undefined
    currentModalMenu: string | undefined
    currentModal: string | undefined
    isShowModal: boolean | undefined
}

export interface InventoryControlHistoryManagement {
    currentModal: string | undefined
    isShowModal: boolean | undefined
    accountInventoryControls: InventoryControl[] | undefined
    currentInventoryControl: InventoryControl | undefined
    currentItem: Item | undefined
    accountItems: Item[] | undefined
}

export interface PointOfSaleManagement {
    currentModal: string | undefined
    isShowModal: boolean | undefined
    items: Item[] | undefined
    transaction: Transaction | undefined
    transactionItemMaps: TransactionItemMap[] | undefined

    searchValue: string | undefined
}

export interface PageState {
    itemManagement: ItemManagementState;
    accountManagement: AccountManagementState
    locationManagement: LocationManagementState
    companyAccountManagement: CompanyAccountManagementState
    itemStockForecastManagement: ItemStockForecastManagement
    itemTransactionForecastManagement: ItemTransactionForecastManagement
    companyInformationManagement: CompanyInformationManagementState
    inventoryControlHistoryManagement: InventoryControlHistoryManagement
    pointOfSaleManagement: PointOfSaleManagement
}

export default createSlice({
    name: 'page',
    initialState: <PageState>{
        itemManagement: <ItemManagementState>{
            items: undefined,
            currentItem: undefined,
            currentItemBundleMaps: undefined,
            currentModal: undefined,
            currentLocation: undefined,
            isShowModal: false,
            currentModalMenu: "main",
            currentAction: undefined
        },
        accountManagement: <AccountManagementState>{
            currentAccount: undefined,
            currentRole: undefined
        },
        locationManagement: <LocationManagementState>{
            locations: undefined,
            currentLocation: undefined,
            currentModal: undefined,
            isShowModal: false,
        },
        companyAccountManagement: <CompanyAccountManagementState>{
            companyAccounts: undefined,
            roles: undefined,
            currentCompany: undefined,
            currentAccount: undefined,
            currentRole: undefined,
            currentLocation: undefined,
            currentModal: undefined,
            isShowModal: false,
        },
        itemStockForecastManagement: <ItemStockForecastManagement>{
            items: undefined,
            currentItem: undefined,
            currentStockForecast: undefined,
            currentModal: undefined,
            isShowModal: false,
            currentModalMenu: undefined,
        },
        itemTransactionForecastManagement: <ItemTransactionForecastManagement>{
            items: undefined,
            currentItem: undefined,
            currentTransactionForecast: undefined,
            currentModal: undefined,
            isShowModal: false,
            currentModalMenu: undefined,
        },
        companyInformationManagement: <CompanyInformationManagementState>{
            currentCompany: undefined,
            currentLocation: undefined,
            currentLocations: undefined,
            currentModalMenu: undefined,
            currentModal: undefined,
            isShowModal: false,
        },
        inventoryControlHistoryManagement: <InventoryControlHistoryManagement>{
            currentModal: undefined,
            isShowModal: false,
            accountInventoryControls: undefined,
            currentInventoryControl: undefined,
            accountItems: undefined,
            currentItem: undefined,
        },
        pointOfSaleManagement: <PointOfSaleManagement>{
            currentModal: undefined,
            isShowModal: false,
            items: undefined,
            transaction: undefined,
            transactionItemMaps: undefined,
            searchValue: undefined
        }
    },
    reducers: {
        configureAccountManagement(state, action) {
            state.accountManagement = action.payload;
        },
        configureItemManagement(state, action) {
            state.itemManagement = action.payload;
        },
        configureLocationManagement(state, action) {
            state.locationManagement = action.payload;
        },
        configureCompanyAccountManagement(state, action) {
            state.companyAccountManagement = action.payload;
        },
        configureItemStockForecastManagement(state, action) {
            state.itemStockForecastManagement = action.payload
        },
        configureItemTransactionForecastManagement(state, action) {
            state.itemTransactionForecastManagement = action.payload
        },
        configureCompanyInformationManagement(state, action) {
            state.companyInformationManagement = action.payload;
        },
        configureInventoryControlHistoryManagement(state, action) {
            state.inventoryControlHistoryManagement = action.payload;
        },
        configurePointOfSaleManagement(state, action) {
            state.pointOfSaleManagement = action.payload;
        }
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.page,
            }
        }
    }
});



