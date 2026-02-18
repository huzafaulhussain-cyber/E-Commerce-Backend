const reviewService = require('../services/reviewservice');

const createReview = async (req, res) => {
    const user = req.user; // await hata diya, ye direct milta hai middleware se
    try {
        const review = await reviewService.createReview(req.body, user);
        return res.status(201).send(review);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

const getAllReviews = async (req, res) => {
    const productId = req.params.productId;
    try {
        const reviews = await reviewService.getAllReviews(productId);
        return res.status(200).send(reviews);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}
const deleteReview = async (req, res) => {
    const reviewId = req.params.reviewId;
    const user = req.user; // Middleware se aya user
    try {
        await reviewService.deleteReview(reviewId, user._id);
        return res.status(200).send({ message: "Review deleted successfully" });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}
module.exports = { createReview, getAllReviews,deleteReview };