import express from "express"
const router = new express.Router()
import invController from "../controllers/invController.js"
import utilities from "../utilities/index.js"

// Route for sorting
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route for detail
router.get("/detail/:invId", utilities.handleErrors(invController.getItemDetail));

// FIX: Use invController instead of invCont
router.get("/trigger-error", utilities.handleErrors(invController.triggerError))

export default router;