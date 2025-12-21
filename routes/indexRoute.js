import express from "express";
import IndexController from "../controllers/indexController.js";
const router = express.Router();

// Sample route
router.get("/customerlist",IndexController.customerlist);     
router.post("/register", IndexController.register);  

export default router;