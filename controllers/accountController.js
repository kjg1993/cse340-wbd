import utilities from "../utilities/index.js"
import accountModel from "../models/account-model.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import 'dotenv/config'
const accountController = {}

/* ****************************************
* Deliver login view
* *************************************** */
accountController.buildLogin = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
* Deliver registration view
* *************************************** */
accountController.buildRegister = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}


/* ****************************************
* Process Registration
* *************************************** */
accountController.registerAccount = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
    return
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "success",
      `Congratulations, you're registered ${account_firstname} ${account_lastname}! Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null, 
    })
  } else {
    req.flash("error", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
* Process login request 
**************************************** */
accountController.accountLogin = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Please check your credentials.")
    return res.status(400).render("account/login", { title: "Login", nav, errors: null, account_email })
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })

      // Always use path: '/' to ensure cookie is accessible everywhere
      const isSelected = process.env.NODE_ENV === 'development' ? false : true;
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: isSelected,
        path: '/',
        maxAge: 3600 * 1000
      })

      return res.redirect("/account/")
    } else {
      req.flash("notice", "Please check your credentials.")
      res.status(400).render("account/login", { title: "Login", nav, errors: null, account_email })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
* Deliver Account Management view
* ************************************ */
accountController.buildAccountManagement = async function (req, res, next) {
  let nav = await utilities.getNav()

  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

/* ****************************************
* Process Logout
**************************************** */
accountController.accountLogout = async function (req, res, next) {
  res.clearCookie("jwt", { path: '/' });
  res.locals.loggedin = 0;
  res.locals.accountData = null;
  req.flash("notice", "You have been logged out.")
  res.redirect("/")
}
/* ****************************************
* Deliver Update Account view
* *************************************** */
accountController.buildUpdate = async function (req, res, next) {
  const account_id = parseInt(req.params.account_id)
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(account_id)
  res.render("account/update", {
    title: "Edit Account",
    nav,
    errors: null,
    accountData,
  })
}

/* ****************************************
* Process Account Update
* *************************************** */
accountController.updateAccount = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body

  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (updateResult) {
    const accountData = await accountModel.getAccountById(account_id)

    delete accountData.account_password

    const accessToken = jwt.sign(
      accountData,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 3600 }
    )

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 3600 * 1000
    })

    req.flash("success", "Account updated successfully.")
    res.redirect("/account/")

  } else {
    req.flash("error", "Sorry, the update failed.")
    res.status(501).render("account/update", {
      title: "Edit Account",
      nav,
      errors: null,
      accountData: { account_firstname, account_lastname, account_email, account_id }
    })
  }
}

/* ****************************************
* Process Password Change
* *************************************** */
accountController.updatePassword = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body

  const hashedPassword = await bcrypt.hashSync(account_password, 10)
  const updateResult = await accountModel.updatePassword(hashedPassword, account_id)

  if (updateResult) {
    req.flash("success", "Password updated successfully.")
    res.redirect("/account/")
  } else {
    req.flash("error", "Sorry, the password update failed.")
    res.redirect(`/account/update/${account_id}`)
  }
}

export default accountController