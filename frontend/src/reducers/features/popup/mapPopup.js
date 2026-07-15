import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    open: false
}

const mapPopup = createSlice({
    name: 'mapPopup',
    initialState,
    reducers: {
        setOpen: (state, action) => {
            state.open = action.payload
        }
    }
})

export const { setOpen } = mapPopup.actions
export default mapPopup.reducer