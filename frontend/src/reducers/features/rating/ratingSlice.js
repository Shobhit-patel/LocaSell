import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const submitRating = createAsyncThunk(
    "rating/submitRating",
    async ({ sellerId, rating, review }, thunkAPI) => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/rating/rate`,
                {
                    sellerId,
                    rating,
                    review,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Something went wrong"
            );
        }
    }
);

const ratingSlice = createSlice({
    name: "rating",
    initialState: {
        loading: false,
        success: false,
        error: null,
    },

    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(submitRating.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })

            .addCase(submitRating.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })

            .addCase(submitRating.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default ratingSlice.reducer;