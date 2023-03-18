import {persistReducer, persistStore} from "redux-persist";
import storage from "redux-persist/lib/storage";
import {Action, combineReducers} from "redux";
import {ThunkAction} from "redux-thunk";
import {createWrapper} from "next-redux-wrapper";
import authenticationSlice from "@/slices/authentication_slice";
import {configureStore} from "@reduxjs/toolkit";
import messageModalSlice from "@/slices/message_modal_slice";


const rootReducer = combineReducers({
    [authenticationSlice.name]: authenticationSlice.reducer,
    [messageModalSlice.name]: messageModalSlice.reducer,
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
        const persistConfig = {
            key: "persist",
            whitelist: ["authentication", "messageModal"],
            storage,
        };
        const persistedReducer = persistReducer(persistConfig, rootReducer);
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