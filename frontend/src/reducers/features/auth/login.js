import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

export const submitLoginData = createAsyncThunk(
    'login/submitLoginData',
    async (loginData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, loginData,);
                return response.data;
            } else {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/userback`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },  
                });
                return response.data;
            }
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Something went wrong'
            );
        }
    }
);

// edit profile
export const editProfile = createAsyncThunk(
    "user/editProfile",
    async (profileData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/edit-profile`, profileData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return res.data.user;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Update failed"
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
    userListing: null
}
const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            
            localStorage.removeItem("token");
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(submitLoginData.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(submitLoginData.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.userListing = action.payload.listing

                localStorage.setItem(
                    "token",
                    action.payload.token
                );

            })
            .addCase(submitLoginData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(editProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(editProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
})

export const { logout } = loginSlice.actions
export default loginSlice.reducer
