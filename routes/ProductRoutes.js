const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');

// Route: Fetch all Products
router.get('/', ProductController.getAllProducts);

// Route: Fetch a single Product by ID
router.get('/:id', ProductController.getProductById);

// Route: Create a new Product
router.post('/', ProductController.createProduct);

// Route: Update an existing Product by ID
router.put('/:id', ProductController.updateProductById);

// Route: Remove a Product by ID
router.delete('/:id', ProductController.deleteProductById);

module.exports = router;
