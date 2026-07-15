import { createSlice } from '@reduxjs/toolkit'
import uploadedProducts from '../../sampleData/uploadProducts.json'

const initialState = {
    image: [],
    productInfo: {},
    productData: uploadedProducts,
}

const uploadedProdSlice = createSlice({
    name: 'uploaded',
    initialState,
    reducers: {
        addImage: (state, action) => {
            state.image = action.payload
        },

        setProductInfo: (state, action) => {
            state.productInfo = action.payload
        },

        setProductData: (state, action) => {
            state.productData.push(action.payload)
        },
    }
})

export const { addImage, setProductInfo, setProductData } = uploadedProdSlice.actions
export default uploadedProdSlice.reducer