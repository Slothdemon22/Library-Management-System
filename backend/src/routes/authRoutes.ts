import express from "express";

import { createUser  } from "../controllers/userControllers/registerController.js";
import { logout } from "../controllers/userControllers/logoutController.js";
import { login } from "../controllers/userControllers/loginController.js";
import { OauthLogin } from "../controllers/userControllers/OauthLogin.js";


const router = express.Router();
router.post('/register', createUser)
router.post('/login', login)
router.post('/logout', logout)
router.post('/OauthLogin', OauthLogin); 


export default router