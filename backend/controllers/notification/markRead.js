import Notification from "../../models/Notification.js";

export const markNotificationsAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            {
                receiver: req.params.userId,
                seen: false,
            },
            {
                $set: { seen: true },
            }
        );

        res.json({ message: "Notifications marked as read" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};