import express from "express"
import expressLayouts from "express-ejs-layouts"
import dotenv from "dotenv"
dotenv.config()
const app = express()

// Importaciones
import staticRoutes from "./routes/static.js" 
import baseController from "./controllers/baseController.js"
import inventoryRoute from "./routes/inventoryRoute.js"

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

// Rutas de Inventario
app.use("/inv", inventoryRoute)

// Index Route
app.get('/', baseController.buildHome);

/* ***********************
 * Server Information
 *************************/
const port = process.env.PORT || 10000
const host = process.env.HOST || '0.0.0.0'

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})