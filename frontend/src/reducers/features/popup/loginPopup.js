import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpen: false,
    isLogin: false,
}

const loginPopup = createSlice({
    name: 'loginPopup',
    initialState,
    reducers: {
        setIsOpen: (state, action) => {
            state.isOpen = action.payload
        },

        setIsLogin: (state, action) => {
            state.isLogin = action.payload
        },
    }
})

export const { setIsOpen, setIsLogin } = loginPopup.actions
export default loginPopup.reducer