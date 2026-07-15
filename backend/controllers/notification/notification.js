import Notification from "../../models/Notification.js";

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            receiver: req.params.userId,
            seen: false,
        })
            .populate("sender", "name")
            .sort({ createdAt: -1 });

        res.status(200).json(notifications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }


};