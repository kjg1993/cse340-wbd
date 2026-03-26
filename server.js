import express from "express"
import expressLayouts from "express-ejs-layouts"
import 'dotenv/config' 
import session from "express-session"
import pool from './database/index.js'
import pgSession from "connect-pg-simple"
import flash from 'connect-flash' 
import expressMessages from 'express-messages' 
import bodyParser from "body-parser"

const app = express()
const PostgresStore = pgSession(session)

import staticRoutes from "./routes/static.js" 
import baseController from "./controllers/baseController.js"
import inventoryRoute from "./routes/inventoryRoute.js"
import utilities from "./utilities/index.js"
import accountRoute from "./routes/accountRoute.js"

/* ***********************
 * View Engine and Layouts
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") 

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new PostgresStore({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))


app.use(flash())
app.use(function(req, res, next){
  res.locals.messages = expressMessages(req, res)
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

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

// Account routes
app.use("/account", accountRoute)

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