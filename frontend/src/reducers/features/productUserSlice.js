import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    productUser: null
}

const productUserSlice = createSlice({
    name: 'productUser',
    initialState,
    reducers: {
        getProductUser: (state, action) => {
            state.productUser = action.payload
        }
    }
})

export const { getProductUser } = productUserSlice.actions
export default productUserSlice.reducer