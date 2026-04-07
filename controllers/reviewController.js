import reviewModel from '../models/review-model.js'
import utilities from '../utilities/index.js'

/* *****************************
* Process Add Review
* *************************** */
const addReview = async function (req, res, next) {
    try {
        const { review_text, inv_id, account_id, review_rating } = req.body

        const result = await reviewModel.addReview(review_text, inv_id, account_id, review_rating)

        if (result) {
            req.flash("success", "Your review was submitted successfully.")
            res.redirect(`/inv/detail/${inv_id}`)
        } else {
            req.flash("notice", "Sorry, there was an error submitting your review.")
            res.redirect(`/inv/detail/${inv_id}`)
        }
    } catch (error) {
        next(error)
    }
}

export default { addReview }