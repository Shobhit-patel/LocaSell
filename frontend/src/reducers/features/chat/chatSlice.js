import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getChats, getMessages, createChat } from "./chatApi"


// fetch chat list
export const fetchChats =
    createAsyncThunk(
        "chat/fetchChats",
        async (userId) => {
            const res = await getChats(userId);
            return res.data;
        });


// fetch messages
export const fetchMessages =
    createAsyncThunk(
        "chat/fetchMessages",
        async (chatId) => {
            const res = await getMessages(chatId);
            return res.data;
        });


// create chat
export const startChat =
    createAsyncThunk(
        "chat/create",
        async (data) => {
            const res = await createChat(data);
            return res.data;
        });

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: [],
        messages: [],
        activeChat: null,
        loading: false
    },
    reducers: {
        setActiveChat: (state, action) => {
            state.activeChat = action.payload;
        },

        addMessage: (state, action) => {
            state.messages.push(
                action.payload
            );
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(
                fetchChats.pending, (state) => {
                    state.loading = true
                })

            .addCase(
                fetchChats.fulfilled, (state, action) => {
                    state.loading = false;
                    state.chats = action.payload;
                })

            .addCase(
                fetchMessages.fulfilled, (state, action) => {
                    state.messages = action.payload;
                })

            .addCase(
                startChat.fulfilled, (state, action) => {
                    const exists = state.chats.find(
                        c => c._id === action.payload._id
                    );
                    if (!exists) {
                        state.chats.push(action.payload
                        );

                    }
                    state.activeChat = action.payload;
                });
    }
});


export const { setActiveChat, addMessage } = chatSlice.actions;
export default chatSlice.reducer;