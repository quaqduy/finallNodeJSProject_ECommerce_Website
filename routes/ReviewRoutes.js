const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/ReviewController');

// Route: Fetch all reviews for a product
router.get('/product/:productId', ReviewController.getReviewsByProductId);

// Route: Fetch a single review by ID
router.get('/:id', ReviewController.getReviewById);

// Route: Create a new review
router.post('/', ReviewController.createReview);

// Route: Update a review by ID
router.put('/:id', ReviewController.updateReviewById);

// Route: Delete a review by ID
router.delete('/:id', ReviewController.deleteReviewById);

module.exports = router;
