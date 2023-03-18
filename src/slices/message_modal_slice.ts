import {createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from "next-redux-wrapper";

export interface MessageModalState {
    isShow: boolean;
    title: string;
    content: string;
}


export default createSlice({
    name: 'messageModal',
    initialState: <MessageModalState>{
        isShow: false,
        title: "",
        content: "",
    },
    reducers: {
        configure: (state, action) => {
            state.content = action.payload.content;
            state.title = action.payload.title;
            state.isShow = action.payload.isShow;
        },
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.messageModal,
            }
        },
    }
});




