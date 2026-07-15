import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const submitSoListingData = createAsyncThunk(
    "soListing/submitSoListingData",
    async (soListingData, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/listings`,
                {
                    params: soListingData
                }
            );
            return response?.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Something went wrong"
            );
        }
    }
);


const initialState = {
    soListing: null,
    success: false,
    loading: false,
    error: null,

    filter: {
        category: 'All listings',
        price: 100000,
        radius: 5,
        condition: '',
        latitude: null,
        longitude: null,
        search: ''
    }

};

const soListing = createSlice({
    name: "soListing",
    initialState,

    reducers: {
        setFilter: (state, action) => {
            state.filter = {
                ...state.filter,
                ...action.payload
            };
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(
                submitSoListingData.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                    state.success = false;
                }
            )

            .addCase(
                submitSoListingData.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.soListing = action.payload?.data;
                    state.success = true;
                }
            )

            .addCase(
                submitSoListingData.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            );
    }
});

export const { setFilter } = soListing.actions;
export default soListing.reducer;