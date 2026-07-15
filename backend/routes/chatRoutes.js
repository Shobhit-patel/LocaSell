import express from "express";
import Message from "../models/Message.js";
import { createChat } from "../controllers/chatController/createChatController.js";
import { getChats } from "../controllers/chatController/getChatController.js";
import { verifyToken } from "../middleware/verify.js";

const router = express.Router();

router.post("/create", verifyToken, createChat);
router.get("/user/:userId", getChats)

//get messsage for chat
router.get("/messages/:chatId", async (req, res) => {
  try {
    const messages = await Message.find({
      chat: req.params.chatId,
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

export default router;