import { Server } from "socket.io";
import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import Notification from "../models/Notification.js";

const onlineUsers = new Map();

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        // join chat room
        socket.on("join-chat", (chatId) => {
            socket.join(chatId);
        });

        // Add this
        socket.on("register-user", (userId) => {
            onlineUsers.set(userId, socket.id);

            socket.userId = userId;

            socket.emit("online-users", [...onlineUsers.keys()]);

            io.emit("user-status", {
                userId,
                online: true,
            });
        });

        // send message
        socket.on("send-message", async (data) => {
            try {
                const { chatId, sender, receiver, text, type = "text", location, } = data;

                //  save message
                const message = await Message.create({
                    chat: chatId,
                    sender,
                    type,
                    text,
                    location,
                });

                //  update chat list (WhatsApp style last message)
                await Chat.findByIdAndUpdate(chatId, {
                    lastMessage: type === "location" ? " Shared Location" : text,
                    lastMessageAt: new Date(),
                });

                //  emit message to room
                const populatedMessage = await Message.findById(message._id)
                    .populate("sender");

                io.to(chatId).emit("receive-message", populatedMessage);

                // Check if receiver is online
                const receiverSocketId = onlineUsers.get(receiver);

                if (!receiverSocketId) {
                    await Notification.create({
                        receiver,
                        sender,
                        chatId,
                        text: type === "location" ? " Shared Location" : text,
                        seen: false,
                    });
                }

            } catch (err) {
                console.log(err);
            }
        });

        socket.on("disconnect", () => {
            if (socket.userId) {
                onlineUsers.delete(socket.userId);

                io.emit("user-status", {
                    userId: socket.userId,
                    online: false,
                });
            }

            console.log("User disconnected:", socket.id);
        });
    });

    return io;
};

export default initializeSocket;
