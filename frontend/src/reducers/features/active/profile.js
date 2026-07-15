import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isActive: 'profile'
}

const profile = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setIsActive: (state, action) => {
            state.isActive = action.payload
        },
    }
})

export const { setIsActive } = profile.actions
export default profile.reducer