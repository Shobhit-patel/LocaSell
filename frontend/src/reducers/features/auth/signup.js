import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

export const submitSignupData = createAsyncThunk(
    'signup/submitSignupData',
    async (signupData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, signupData);
            return response?.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Something went wrong'
            );
        }
    }
);

const token = localStorage.getItem("token");

const initialState = {
    user: null,
    token: token || null,
    isAuthenticated: !!token,
    loading: false,
    error: null,

}

const signupSlice = createSlice({
    name: 'signup',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(submitSignupData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitSignupData.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;

                localStorage.setItem("token", action.payload.token);

            })
            .addCase(submitSignupData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
})

export const { } = signupSlice.actions
export default signupSlice.reducer
