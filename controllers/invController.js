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

/* ****************************************
 * Management View Delivery 
 * *************************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    messages: req.flash() 
  })
}

/* ****************************************
 * Add Classification View & Process
 * *************************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    classification_name: "",
    messages: req.flash()
  })
}

invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body
  const result = await invModel.insertClassification(classification_name)
  let nav = await utilities.getNav()

  if (result && result.rowCount > 0) {
    req.flash("success", `The ${classification_name} classification was successfully added.`)
    res.redirect("/inv") 
  } else {
    req.flash("error", "Sorry, adding the classification failed.")
    res.redirect("/inv/add-classification") 
  }
}

/* **********************************
 * Deliver Add Inventory View
 * ********************************* */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()

    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      errors: null,
      messages: req.flash(),
      inv_make: "",
      inv_model: "",
      inv_year: "",
      inv_price: "",
      inv_miles: "",
      inv_color: "",
      inv_description: "",
      inv_image: "/images/vehicles/no-image.png",
      inv_thumbnail: "/images/vehicles/no-image-tn.png"
    })
  } catch (error) {
    console.log(error);
    next(error)
  }
}

invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const {
    inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles,
    inv_color, classification_id
  } = req.body

  const result = await invModel.insertInventory(
    inv_make, inv_model, inv_year, inv_description,
    inv_image || "/images/vehicles/no-image.png",
    inv_thumbnail || "/images/vehicles/no-image-tn.png",
    inv_price, inv_miles,
    inv_color, classification_id
  )

  if (result && result.rowCount > 0) {
    req.flash("success", `The ${inv_make} ${inv_model} was successfully added.`)
    res.redirect("/inv")
  } else {
    req.flash("error", "Failed to add vehicle.")
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      errors: [{ msg: "Database error: Could not add vehicle." }],
      messages: req.flash(),
      inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
    })
  }
}

export default invCont