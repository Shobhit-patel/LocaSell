import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    open: false
}

const ratingPopup = createSlice({
    name: 'ratingPopup',
    initialState,
    reducers: {
        setRatingOpen: (state, action) => {
            state.open = action.payload
        }
    }
})

export const { setRatingOpen } = ratingPopup.actions
export default ratingPopup.reducer