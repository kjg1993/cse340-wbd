// models/review-model.js
import pool from '../database/index.js'

const reviewModel = {}

/* *****************************
* Add New Review with Rating
* *************************** */
reviewModel.addReview = async function (review_text, inv_id, account_id, review_rating) {
    try {
        const sql = "INSERT INTO public.review (review_text, inv_id, account_id, review_rating) VALUES ($1, $2, $3, $4) RETURNING *"
        const result = await pool.query(sql, [review_text, inv_id, account_id, review_rating])
        return result.rows[0]
    } catch (error) {
        console.error("Error adding review:", error)
        return null
    }
}
/* *****************************
* Get Reviews by Inventory ID (with Account Name)
* *************************** */
reviewModel.getReviewsByInvId = async function (inv_id) {
    try {
        const sql = `SELECT r.*, a.account_firstname, a.account_lastname 
                 FROM public.review r 
                 JOIN public.account a ON r.account_id = a.account_id 
                 WHERE r.inv_id = $1 
                 ORDER BY r.review_date DESC`
        const data = await pool.query(sql, [inv_id])
        return data.rows
    } catch (error) {
        console.error("Error getting reviews:", error)
        return []
    }
}

/* *****************************
* Get Review Stats (Average & Count)
* *************************** */
reviewModel.getReviewStats = async function (inv_id) {
    try {
        const sql = `SELECT 
                        COUNT(review_id) AS total_reviews, 
                        ROUND(AVG(review_rating), 1) AS average_rating 
                     FROM public.review 
                     WHERE inv_id = $1`
        const data = await pool.query(sql, [inv_id])
        return data.rows[0]
    } catch (error) {
        console.error("getReviewStats error: " + error)
        return { total_reviews: 0, average_rating: 0 }
    }
}

export default reviewModel