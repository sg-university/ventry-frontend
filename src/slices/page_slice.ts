import {createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from "next-redux-wrapper";
import Item from "@/models/entities/item";
import Account from "@/models/entities/account";
import Location from '@/models/entities/location';


export interface ItemManagementState {
    items: Item[]
}

export interface AccountManagementState {
    account: Account | null
}

export interface LocationManagementState {
  locations: Location[]
}


export interface PageState {
    itemManagement: ItemManagementState;
    accountManagement: AccountManagementState
    locationManagement: LocationManagementState
}


export default createSlice({
    name: 'page',
    initialState: <PageState>{
        itemManagement: <ItemManagementState>{
            items: []
        },
        accountManagement: <AccountManagementState>{
            account: null
        },
        locationManagement: <LocationManagementState>{
          locations: []
      }
    },
    reducers: {
        configureItemManagement: (state, action) => {
            state.itemManagement = action.payload;
        },
        configureAccountManagement: (state, action) => {
            state.accountManagement = action.payload;
        },
        configureLocationManagement: (state, action) => {
          state.locationManagement = action.payload;
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



