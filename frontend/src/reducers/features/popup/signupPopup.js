import { createSlice } from "@reduxjs/toolkit";
import users from '../../../sampleData/user.json'


const initialState = {
    isSignupOpen: false,
    isSignup: false,
    userData: users,
}

const signupPopup = createSlice({
    name: 'signupPopup',
    initialState,
    reducers: {
        setIsSignupOpen: (state, action) => {
            state.isSignupOpen = action.payload
        },

        setIsSignup: (state, action) => {
            state.isSignup = action.payload
        },
    },
})

export const { setIsSignupOpen, setIsSignup } = signupPopup.actions
export default signupPopup.reducer
