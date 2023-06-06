import {createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from "next-redux-wrapper";

export interface ConfirmationModalState {
    isShow: boolean | undefined;
    content: string | undefined;
    callback: () => void | undefined;
}


export default createSlice({
    name: 'confirmationModal',
    initialState: <ConfirmationModalState>{
        isShow: false,
        content: undefined,
        callback: () => {
        },
    },
    reducers: {
        configure: (state, action) => {
            state.content = action.payload.content;
            state.isShow = action.payload.isShow;
            state.callback = action.payload.callback;
        },
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.confirmationModal,
            }
        },
    }
});




