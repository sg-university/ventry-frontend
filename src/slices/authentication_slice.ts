import {createSlice} from '@reduxjs/toolkit';
import Account from "@/models/entities/account";
import {HYDRATE} from "next-redux-wrapper";
import storage from "redux-persist/lib/storage";
import Role from "@/models/entities/role";

export interface AuthenticationState {
    currentAccount: Account | undefined;
    currentRole: Role | undefined;
    isLoggedIn: boolean | undefined;
}


export default createSlice({
    name: 'authentication',
    initialState: <AuthenticationState>{
        currentAccount: undefined,
        currentRole: undefined,
        isLoggedIn: false,
    },
    reducers: {
        login: (state, action) => {
            state.currentAccount = action.payload.currentAccount;
            state.currentRole = action.payload.currentRole;
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.currentAccount = undefined;
            state.isLoggedIn = false;
            storage.removeItem("persist")
        },
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.authentication,
            }
        }
    }
});



