const express = require('express');
const router = express.Router();
const reviewcontroller = require('../Controller/reviewcontroller.js');
const { authenticate } = require('../middleware/authenticate.js');

// Create Review (Isme Rating + Review dono jayenge)
router.post('/create', authenticate, reviewcontroller.createReview);

// Get All Reviews
router.get('/product/:productId', reviewcontroller.getAllReviews);
router.delete('/:reviewId', authenticate, reviewcontroller.deleteReview);

module.exports = router;