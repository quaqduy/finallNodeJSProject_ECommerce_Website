const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');

// Route: Fetch all Categories
router.get('/', CategoryController.getAllCategories);

// Route: Fetch a single Category by ID
router.get('/:id', CategoryController.getCategoryById);

// Route: Create a new Category
router.post('/', CategoryController.createCategory);

// Route: Update an existing Category by ID
router.put('/:id', CategoryController.updateCategoryById);

// Route: Delete a Category by ID
router.delete('/:id', CategoryController.deleteCategoryById);

module.exports = router;
