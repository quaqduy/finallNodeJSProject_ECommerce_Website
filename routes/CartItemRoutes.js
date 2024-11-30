const express = require('express');
const router = express.Router();
const CartItemController = require('../controllers/CartItemController');

// Route: Fetch all Cart Items
router.get('/', CartItemController.getAllCartItems);

// Route: Fetch Cart Items by Cart ID
router.get('/cart/:cartId', CartItemController.getCartItemsByCartId);

// Route: Add a new Cart Item
router.post('/', CartItemController.createCartItem);

// Route: Update a Cart Item by ID
router.put('/:id', CartItemController.updateCartItemById);

// Route: Delete a Cart Item by ID
router.delete('/:id', CartItemController.deleteCartItemById);

module.exports = router;
