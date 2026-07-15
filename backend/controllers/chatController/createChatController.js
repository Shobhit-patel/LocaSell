import Chat from "../../models/Chat.js";

export const createChat = async (req, res) => {
    try {
        const buyer = req.user._id;
        const { seller, product } = req.body;

        if (!buyer || !seller || !product) {
            return res.status(400).json({ 
                message: "Missing data"
            });
        }

        let chat = await Chat.findOne({
            buyer,
            seller,
            Product: product
        });

        if (!chat) {
            chat = await Chat.create({
                buyer,
                seller,
                Product: product
            });
        }

        const populatedChat = await Chat.findById(chat._id)
            .populate("Product")
            .populate("seller")

        return res.status(200).json(populatedChat);

    } catch (error) {
        console.log("CREATE CHAT ERROR:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};