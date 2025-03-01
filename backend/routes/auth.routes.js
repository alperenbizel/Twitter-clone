import express from "express";
import {protectRoute} from "../middleware/protectRoute.js";
import {signup,login,logout, getme} from "../controllers/auth.controllers.js";
const router=express.Router();

router.post("/signup",signup)

router.post("/login",login)

router.post("/logout",logout)

router.get("getme",protectRoute,getme)

export default router;