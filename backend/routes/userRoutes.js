import express from "express";
import { signup } from "../controllers/authController/signupController.js";
import { login } from "../controllers/authController/loginController.js";
import { getBack } from "../controllers/authController/getBackUser.js";
import { editProfile } from "../controllers/authController/editProfile.js";
import { verifyToken } from "../middleware/verify.js";

const router = express.Router();

router.post('/register', signup);
router.post('/login', login);
router.get('/userback', getBack);
router.put('/edit-profile', verifyToken, editProfile);

export default router;