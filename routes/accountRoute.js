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

router.get("/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement));

// Route for Logout
router.get("/logout", (req, res) => {
  res.clearCookie("jwt")
  res.redirect("/")
})

//Route to process to intent to login 
router.post("/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Ruta para entregar la vista de actualización
router.get("/update/:account_id", utilities.handleErrors(accountController.buildUpdate))


router.post(
  "/update",
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)


router.post(
  "/password",
  regValidate.passwordRules(),
  regValidate.checkUpdateData, 
  utilities.handleErrors(accountController.updatePassword)
)
// Ruta de Logout (Tarea 6)
router.get("/logout", accountController.accountLogout)

export default router;