import {createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from "next-redux-wrapper";
import Item from "@/models/entities/item";
import Account from "@/models/entities/account";


export interface ItemManagementState {
    items: Item[]

}

export interface AccountManagementState {
    account: Account | null
}

export interface PageState {
    itemManagement: ItemManagementState;
    accountManagement: AccountManagementState
}


export default createSlice({
    name: 'page',
    initialState: <PageState>{
        itemManagement: <ItemManagementState>{
            items: []
        },
        accountManagement: <AccountManagementState>{
            account: null
        }
    },
    reducers: {
        configureItemManagement: (state, action) => {
            state.itemManagement = action.payload;
        },
        configureAccountManagement: (state, action) => {
            state.accountManagement = action.payload;
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



