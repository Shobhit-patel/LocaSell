import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    open: false
}

const sellerPopup = createSlice({
    name: 'sellerPopup',
    initialState,
    reducers: {
        setOpen: (state, action) => {
            state.open = action.payload
        }
    }
})

export const { setOpen } = sellerPopup.actions
export default sellerPopup.reducer