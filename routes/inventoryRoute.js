
import express from "express"
const router = new express.Router() 
import invController from "../controllers/invController.js"

router.get("/type/:classificationId", invController.buildByClassificationId);

export default router; 