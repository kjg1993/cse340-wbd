import express from "express"
const router = new express.Router()
import invController from "../controllers/invController.js"
import utilities from "../utilities/index.js"
import invValidate from "../utilities/inventory-validation.js"

// ****************************************
// View Delivery Routes (GET)
// ****************************************

// Route for the management view 
router.get("/", utilities.handleErrors(invController.buildManagement))

// Route to add classification
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// Path to add inventory 
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// Route to display vehicles by classification
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to view details of a specific vehicle
router.get("/detail/:invId", utilities.handleErrors(invController.getItemDetail))

// Route to test the intentional 500 error
router.get("/trigger-error", utilities.handleErrors(invController.throwError))


// ****************************************
// Data Processing Routes (POST)
// ****************************************

router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkData,
  utilities.handleErrors(invController.addClassification)
)


router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkData,
  utilities.handleErrors(invController.addInventory)
)

export default router