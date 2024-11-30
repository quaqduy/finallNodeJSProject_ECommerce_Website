const express = require('express');
const router = express.Router();
const CartController = require('../controllers/CartController');

// Route: Fetch all Carts
router.get('/', CartController.getAllCarts);

// Route: Fetch Cart by ID
router.get('/:id', CartController.getCartById);

// Route: Create a new Cart
router.post('/', CartController.createCart);

// Route: Update a Cart by ID
router.put('/:id', CartController.updateCartById);

// Route: Delete a Cart by ID
router.delete('/:id', CartController.deleteCartById);

module.exports = router;
