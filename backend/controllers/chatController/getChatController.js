import Chat from "../../models/Chat.js";

export const getChats = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const chats = await Chat.find({
      $or: [
        { buyer: userId },
        { seller: userId }
      ]
    })
      .sort({ lastMessageAt: -1 })
      .populate("Product")
      .populate("buyer")
      .populate("seller");

    return res.status(200).json(chats);

  } catch (error) {
    console.log("GET CHAT ERROR:", error);
    return res.status(500).json({
      message: error.message
    });
  }
};