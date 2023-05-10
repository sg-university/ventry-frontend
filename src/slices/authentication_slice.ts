import {createSlice} from '@reduxjs/toolkit';
import Account from "@/models/entities/account";
import {HYDRATE} from "next-redux-wrapper";
import storage from "redux-persist/lib/storage";

export interface AuthenticationState {
    entity: Account | undefined;
    isLoggedIn: boolean | undefined;
}


export default createSlice({
    name: 'authentication',
    initialState: <AuthenticationState>{
        entity: undefined,
        isLoggedIn: false,
    },
    reducers: {
        login: (state, action) => {
            state.entity = action.payload;
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.entity = undefined;
            state.isLoggedIn = false;
            storage.removeItem("persist")
        },
        register: (state, action) => {
            state.entity = action.payload;
            state.isLoggedIn = false;
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



