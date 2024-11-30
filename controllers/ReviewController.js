const Review = require('../models/ReviewModel');

// Fetch all reviews for a product
exports.getReviewsByProductId = async (req, res) => {
  const { productId } = req.params;
  try {
    const reviews = await Review.find({ productId }).populate('userId', 'name'); // Populate user info
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews for product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Fetch a single review by ID
exports.getReviewById = async (req, res) => {
  const { id } = req.params;
  try {
    const review = await Review.findById(id).populate('userId', 'name');
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    console.error('Error fetching review by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new review
exports.createReview = async (req, res) => {
  const { productId, userId, rating, comment } = req.body;

  const newReview = new Review({
    productId,
    userId,
    rating,
    comment,
  });

  try {
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error creating new review:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update an existing review by ID
exports.updateReviewById = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { rating, comment, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a review by ID
exports.deleteReviewById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({ message: 'Review deleted successfully', review: deletedReview });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
