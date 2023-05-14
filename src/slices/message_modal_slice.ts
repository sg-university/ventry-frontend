import {createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from "next-redux-wrapper";

export interface MessageModalState {
    isShow: boolean | undefined;
    type: string | undefined;
    title: string | undefined;
    content: string | undefined;
}


export default createSlice({
    name: 'messageModal',
    initialState: <MessageModalState>{
        isShow: false,
        type: undefined,
        title: undefined,
        content: undefined,
    },
    reducers: {
        configure: (state, action) => {
            state.content = action.payload.content;
            state.type = action.payload.type;
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




