import express from "express"
const router = new express.Router()
import invController from "../controllers/invController.js"
import utilities from "../utilities/index.js"
import invValidate from "../utilities/inventory-validation.js"

// ****************************************
// View Delivery Routes (GET) - PROTECTED
// ****************************************

// Main inventory management view (Middleware applied)
router.get(
  "/", 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildManagement)
)

// Add classification view (Middleware applied)
router.get(
  "/add-classification", 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildAddClassification)
)

// Add inventory item view (Middleware applied)
router.get(
  "/add-inventory", 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildAddInventory)
)

// Edit inventory item view (Middleware applied)
router.get(
  "/edit/:inv_id", 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.editInventoryView)
)

// Delete confirmation view (Middleware applied)
router.get(
  "/delete/:inv_id", 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.deleteView)
)

// ****************************************
// Data Processing Routes (POST) - PROTECTED
// ****************************************

// Process new classification
router.post(
  "/add-classification",
  utilities.checkAccountType,
  invValidate.classificationRules(),
  invValidate.checkData,
  utilities.handleErrors(invController.addClassification)
)

// Process new inventory item
router.post(
  "/add-inventory",
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkData,
  utilities.handleErrors(invController.addInventory)
)

// Process inventory update
router.post(
  "/update/",
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// Process inventory deletion
router.post(
  "/delete", 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.deleteItem)
)

// ****************************************
// Public Routes (GET) - UNPROTECTED
// ****************************************

// List vehicles by classification (Publicly accessible)
router.get(
  "/type/:classificationId", 
  utilities.handleErrors(invController.buildByClassificationId)
)

// Specific vehicle detail (Publicly accessible)
router.get(
  "/detail/:invId", 
  utilities.handleErrors(invController.getItemDetail)
)

// Get inventory data in JSON format for the management table
router.get(
  "/getInventory/:classification_id", 
  utilities.handleErrors(invController.getInventoryJSON)
)

// Route to test the intentional 500 error
router.get(
  "/trigger-error", 
  utilities.handleErrors(invController.throwError)
)

export default router