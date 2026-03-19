/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/


/* ***********************
 * Require Statements
 *************************/
import express from "express"
import expressLayouts from "express-ejs-layouts"
import dotenv from "dotenv"
dotenv.config()
const app = express()

// Importación de rutas y controladores
import staticRoutes from "./routes/static.js" 
import baseController from "./controllers/baseController.js"
import inventoryRoute from "./routes/inventoryRoute.js"


/* ***********************
 * View Engine and Layouts
 * (Configuración movida antes de las rutas)
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") 

/* ***********************
 * Routes
 *************************/
// Archivos estáticos y rutas básicas
app.use(express.static('public')) 
app.use(staticRoutes) 

// Rutas de Inventario (Ahora sí con Layout activo)
app.use("/inv", inventoryRoute)

// Index Route
app.get('/', baseController.buildHome);


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST


/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})