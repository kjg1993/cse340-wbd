import express from "express"
import expressLayouts from "express-ejs-layouts"
import dotenv from "dotenv"
dotenv.config()
const app = express()

import staticRoutes from "./routes/static.js" 
import baseController from "./controllers/baseController.js"
import inventoryRoute from "./routes/inventoryRoute.js"
import utilities from "./utilities/index.js"

/* ***********************
 * View Engine and Layouts
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") 

/* ***********************
 * Routes & Static Files
 *************************/
app.use(express.static('public')) 
app.use(staticRoutes) 

//Index route
app.get("/", utilities.handleErrors(baseController.buildHome));

// Inventory Routes
app.use("/inv", inventoryRoute)

// Index Route
app.get('/', baseController.buildHome);

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})


/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  let message 
  if(err.status == 404){ 
    message = err.message 
  } else { 
    message = 'Oh no! There was a crash. Maybe try a different route?' 
  }
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Server Information
 *************************/
const port = process.env.PORT || 10000
const host = process.env.HOST || '0.0.0.0'

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})