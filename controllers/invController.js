import * as invModel from "../models/inventory-model.js"
import utilities from "../utilities/index.js"

const invCont = {}

/* ***************************
 * Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  
  const className = data.length > 0 ? data[0].classification_name : "Unknown"
  
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 * Deliver Item Detail View
 * ************************** */
invCont.getItemDetail = async function (req, res, next) {
  const inv_id = req.params.invId
  
  const data = await invModel.getInventoryByInventoryId(inv_id)
  
  if (!data) {
    const err = new Error('Vehicle not found')
    err.status = 404
    return next(err)
  }

  const html = await utilities.buildItemDetailHtml(data)
  let nav = await utilities.getNav()
  
  res.render("./inventory/detail", {
    title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
    nav,
    grid: html, 
  })
}

/* ***************************
 * Trigger an intentional 500 error
 * ************************** */
invCont.throwError = async (req, res) => {
  const error = new Error("Intentional 500 error testing")
  error.status = 500
  throw error
}

export default invCont 