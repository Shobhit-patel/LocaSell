import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

export const submitSoOneListingData = createAsyncThunk(
    'soOneListing/submitSoOneListingData',
    async (soOneListingData, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/listings/${soOneListingData}`);
            return response?.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Something went wrong'
            );
        }
    }
);

export const toggleListingStatus = createAsyncThunk(
    "soOneListing/toggleListingStatus",
    async (listingId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/mark-sold/${listingId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data.listing;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Something went wrong"
            );
        }
    }
);


const initialState = {
    soOneListingProduct: null,
    soOneListingSeller: null,
    loading: false,
    error: null,
}

const soOneListing = createSlice({
    name: 'soOneListing',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(submitSoOneListingData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitSoOneListingData.fulfilled, (state, action) => {
                state.loading = false;
                state.soOneListingProduct = action.payload.product
                state.soOneListingSeller = action.payload.seller
            })
            .addCase(submitSoOneListingData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(toggleListingStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(toggleListingStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.soOneListingProduct = action.payload;
            })
            .addCase(toggleListingStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
})

export const { } = soOneListing.actions
export default soOneListing.reducer
