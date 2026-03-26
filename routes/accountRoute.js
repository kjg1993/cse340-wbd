import express from "express";
const router = new express.Router();
import utilities from "../utilities/index.js"
import accountController from "../controllers/accountController.js"
import regValidate from "../utilities/account-validation.js"

// Route to deliver the view login
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to deliver the registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to process the resgister (POST)
router.post('/register',
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount));

// Proceso de Login con validación
router.post(
  "/login",
  regValidate.loginRules(),     
  regValidate.checkLoginData,   
  (req, res) => {
    res.status(200).send('Login process successful (Server-side validated!)')
  }
)

export default router;