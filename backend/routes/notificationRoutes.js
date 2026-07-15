import express from "express";
import { getNotifications } from "../controllers/notification/notification.js";
import { markNotificationsAsRead } from "../controllers/notification/markRead.js";

const router = express.Router();

router.get('/:userId', getNotifications);
router.patch("/read/:userId", markNotificationsAsRead);

export default router;