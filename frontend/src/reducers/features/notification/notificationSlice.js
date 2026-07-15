import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// fetch notifications from DB
export const fetchNotifications = createAsyncThunk(
    "notifications/fetchNotifications",
    async (userId) => {
        const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/notification/${userId}`
        );
        return res.data;
    }
);

export const markNotificationsAsRead = createAsyncThunk(
    "notifications/markAsRead",
    async (userId) => {
        await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/notification/read/${userId}`
        );
        return userId;
    }
);


const initialState = {
    items: [],
    loading: false,
};

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        // real-time socket push
        addNotification: (state, action) => {
            state.items.unshift(action.payload);
        },

        clearNotifications: (state) => {
            state.items = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state) => {
                state.loading = false;
            })

            .addCase(markNotificationsAsRead.fulfilled, (state) => {
                state.items = state.items.map((notification) => ({
                    ...notification,
                    seen: true,
                }));
            });

    },


});

export const { addNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;