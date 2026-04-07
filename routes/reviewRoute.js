import express from 'express'
import reviewCont from '../controllers/reviewController.js' 
import utilities from '../utilities/index.js' 
import reviewController from '../controllers/reviewController.js'
import regValidate from "../utilities/review-validation.js"

const router = express.Router()  


router.post("/add",
    utilities.checkJWTToken,
    regValidate.reviewRules(),
    regValidate.checkReviewData,
    utilities.handleErrors(reviewCont.addReview) 
)
export default router  