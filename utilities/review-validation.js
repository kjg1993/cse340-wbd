import { body, validationResult } from "express-validator"
import * as invModel from "../models/inventory-model.js"
import reviewModel from "../models/review-model.js"
import utilities from "./index.js"

const validate = {}

/* **********************************
 * Review Validation Rules
 * ********************************* */
validate.reviewRules = () => {
  return [
    body("review_text")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a comment."),
    
    body("review_rating")
      .trim()
      .isInt({ min: 1, max: 5 })
      .withMessage("Please select a valid rating."),
  ]
}

/* ******************************
 * Check data and return errors or continue to add review
 * ***************************** */
validate.checkReviewData = async (req, res, next) => {
  const { review_text, inv_id, review_rating } = req.body
  let errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    const data = await invModel.getInventoryByInventoryId(inv_id)
    const stats = await reviewModel.getReviewStats(inv_id)
    const reviews = await reviewModel.getReviewsByInvId(inv_id)
    const html = await utilities.buildItemDetailHtml(data)
    const nav = await utilities.getNav()

    res.render("inventory/detail", {
      title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
      nav,
      grid: html,
      vehicleData: data,
      reviews,
      stats,
      errors, 
      review_text, 
      review_rating 
    })
    return
  }
  next()
}

export default validate