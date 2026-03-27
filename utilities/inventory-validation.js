import { body, validationResult } from "express-validator"
import utilities from "./index.js"

import * as invModel from "../models/inventory-model.js"

const validate = {}

/* **********************************
 * Rules for New Classification 
 * ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isAlphanumeric()
      .withMessage("Please provide a valid classification name (no spaces or special characters).")
      .isLength({ min: 1 })
      .withMessage("Classification name is required.")
  ]
}

/* **********************************
 * Rules for New Inventory 
 * ********************************* */
validate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Make is required."),
    body("inv_model")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Model is required."),
    body("inv_year")
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage(`Year must be between 1900 and ${new Date().getFullYear() + 1}.`),
    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),
    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive number."),
    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Color is required."),
    body("inv_description")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters."),
    body("classification_id")
      .isInt({ min: 1 })
      .withMessage("Please select a valid classification.")
  ]
}

/* ******************************
 * Data checker and error return 
 * ***************************** */
validate.checkData = async (req, res, next) => {
  const result = validationResult(req)

  if (!result.isEmpty()) {
    let nav = await utilities.getNav()

    if (req.path.includes("classification")) {
      return res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: result.array(), 
        classification_name: req.body.classification_name || ""  
      })
    }

    const classificationSelect = await utilities.buildClassificationList(
      req.body.classification_id
    )

    return res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      errors: result.array(), 

      inv_make: req.body.inv_make || "",
      inv_model: req.body.inv_model || "",
      inv_year: req.body.inv_year || "",
      inv_price: req.body.inv_price || "",
      inv_miles: req.body.inv_miles || "",
      inv_color: req.body.inv_color || "",
      inv_description: req.body.inv_description || "",
      inv_image: req.body.inv_image || "/images/vehicles/no-image.png",
      inv_thumbnail: req.body.inv_thumbnail || "/images/vehicles/no-image-tn.png"
    })
  }
  next()
}

export default validate