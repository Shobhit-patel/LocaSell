import { Server } from "socket.io";
import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import Notification from "../models/Notification.js";

const onlineUsers = new Map();

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "https://loca-sell.vercel.app",
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

                // always save notification (offline support)
                await Notification.create({
                    receiver,
                    sender,
                    chatId,
                    text: type === "location" ? " Shared Location" : text,
                    seen: false,
                });

                // Notify only the receiver
                const receiverSocketId = onlineUsers.get(receiver);

                if (receiverSocketId) {

                    io.to(receiverSocketId).emit("notification", {
                        chatId,
                        sender,
                        type,
                        text: type === "location" ? "Shared Location" : text,
                        location,
                    });
                }

            } catch (err) {
                console.log(err);
            }
        });

        socket.on("disconnect", () => {
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    break;
                }
            }
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
};

export default initializeSocket;
