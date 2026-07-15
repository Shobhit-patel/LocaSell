import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

export const submitListingData = createAsyncThunk(
    'listing/submitListingData',
    async (listingData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/listings`, listingData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
            );
            return response?.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Something went wrong'
            );
        }
    }
);


const initialState = {
    listing: null,
    success: false,
    loading: false,
    error: null
}

const listing = createSlice({
    name: 'listing',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(submitListingData.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false
            })
            .addCase(submitListingData.fulfilled, (state, action) => {
                state.loading = false;
                state.listing = action.payload.listing
                state.success = true;

            })
            .addCase(submitListingData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
})

export const { } = listing.actions
export default listing.reducer
