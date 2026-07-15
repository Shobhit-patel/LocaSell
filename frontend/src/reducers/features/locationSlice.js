import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currLocationName: 'Set Location',
    currPopUpLocationName: 'Set Location',
}

const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {

        getLocationName: (state, action) => {
            state.currLocationName = action.payload
        },

        getPopUpLocationName: (state, action) => {
            state.currPopUpLocationName = action.payload
        }
    }
})

export const { getLocationName, getPopUpLocationName } = locationSlice.actions
export default locationSlice.reducer