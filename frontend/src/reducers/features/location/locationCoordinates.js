import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currLocation: { lat: 0, lng: 0 },
    currPopUpLocation: { lat: 0, lng: 0 },
}

const locationCoordinates = createSlice({
    name: 'locationCoordinates',
    initialState,
    reducers: {
        //main location permanent   
        getLocation: (state, action) => {
            state.currLocation = action.payload
        },

        // to set location in map (temperory)
        getPopUpLocation: (state, action) => {
            state.currPopUpLocation = action.payload
        },
    }
})

export const { getLocation, getPopUpLocation } = locationCoordinates.actions
export default locationCoordinates.reducer