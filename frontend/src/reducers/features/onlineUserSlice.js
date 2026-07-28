import { createSlice } from "@reduxjs/toolkit";

const onlineUserSlice = createSlice({
    name: "onlineUsers",
    initialState: {
        users: [],
    },
    reducers: {
        setOnlineUsers: (state, action) => {
            state.users = action.payload;
        },

        addOnlineUser: (state, action) => {
            if (!state.users.includes(action.payload)) {
                state.users.push(action.payload);
            }
        },

        removeOnlineUser: (state, action) => {
            state.users = state.users.filter(
                id => id !== action.payload
            );
        },
    },
});

export const { setOnlineUsers, addOnlineUser, removeOnlineUser } = onlineUserSlice.actions;
export default onlineUserSlice.reducer;