import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    imagePopupOpen: false,
    imageUrl: ''
}

const imagePopupSlice = createSlice({
    name: 'imagePopup',
    initialState,
    reducers: {
        setImagePopupOpen: (state, action) => {
            state.imagePopupOpen = action.payload
        },

        setImageUrl: (state, action) => {
            state.imageUrl = action.payload
        }
    }
})

export const { setImagePopupOpen, setImageUrl } = imagePopupSlice.actions
export default imagePopupSlice.reducer