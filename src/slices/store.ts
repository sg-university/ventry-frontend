import {persistReducer, persistStore} from "redux-persist";
import storage from "redux-persist/lib/storage";
import {Action, combineReducers} from "redux";
import {ThunkAction} from "redux-thunk";
import {createWrapper} from "next-redux-wrapper";
import {configureStore} from "@reduxjs/toolkit";
import authenticationSlice from "@/slices/authentication_slice";
import messageModalSlice from "@/slices/message_modal_slice";
import pageSlice from "@/slices/page_slice";


const rootReducer = combineReducers({
    [authenticationSlice.name]: authenticationSlice.reducer,
    [messageModalSlice.name]: messageModalSlice.reducer,
    [pageSlice.name]: pageSlice.reducer,
});

let store: any;

export const makeStore = () => {
    const isServer = typeof window === "undefined";
    if (isServer) {
        store = configureStore({
            reducer: rootReducer,
            devTools: process.env.NODE_ENV !== "production",
        });
        return store
    } else {
        const persistedReducer = persistReducer({
                key: "persist",
                whitelist: ["authentication"],
                storage,
            },
            rootReducer
        );
        store = configureStore({
            reducer: persistedReducer,
            devTools: process.env.NODE_ENV !== "production",
        });
        store.__persist = persistStore(store);
        return store;
    }
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppState,
    unknown,
    Action
>;

export const wrapper = createWrapper<AppStore>(makeStore);

export {store}