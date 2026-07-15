import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    open: false
}

const editPopup = createSlice({
    name: 'editPopup',
    initialState,
    reducers: {
        setOpen: (state, action) => {
            state.open = action.payload
        }
    }
})

export const { setOpen } = editPopup.actions
export default editPopup.reducer