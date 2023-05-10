import {createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from "next-redux-wrapper";
import Item from "@/models/entities/item";
import Account from "@/models/entities/account";
import Location from '@/models/entities/location';
import Company from "@/models/entities/company";
import Role from "@/models/entities/role";
import ItemBundleMap from "@/models/entities/item_bundle_map";


export interface ItemManagementState {
    items: Item[] | undefined
    currentItem: Item | undefined
    currentLocation: Location | undefined
    currentItemBundleMaps: ItemBundleMap[] | undefined
    currentModal: string | undefined
    isShowModal: boolean | undefined
    currentModalMenu: string | undefined
}

export interface AccountManagementState {
    account: Account | undefined
}

export interface LocationManagementState {
    locations: Location[] | undefined
}

export interface CompanyAccountManagementState {
    company: Company | undefined
    accounts: Account[] | undefined
    roles: Role[] | undefined
    locations: Location[] | undefined
    currentAccount: Account | undefined
    currentRole: Role | undefined
    currentLocation: Location | undefined
    currentModal: string | undefined
    isShowModal: boolean | undefined
}


export interface PageState {
    itemManagement: ItemManagementState;
    accountManagement: AccountManagementState
    locationManagement: LocationManagementState
    companyAccountManagement: CompanyAccountManagementState
}


export default createSlice({
    name: 'page',
    initialState: <PageState>{
        itemManagement: <ItemManagementState>{
            items: undefined,
            currentItem: undefined,
            currentLocation: undefined,
            currentItemBundleMaps: undefined,
            currentModal: undefined,
            isShowModal: false,
            currentModalMenu: undefined
        },
        accountManagement: <AccountManagementState>{
            account: undefined
        },
        locationManagement: <LocationManagementState>{
            locations: undefined
        },
        companyAccountManagement: <CompanyAccountManagementState>{
            company: undefined,
            accounts: undefined,
            roles: undefined,
            locations: undefined,
            currentAccount: undefined,
            currentRole: undefined,
            currentLocation: undefined,
            currentModal: undefined,
            isShowModal: false,
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



