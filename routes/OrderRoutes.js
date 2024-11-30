const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');

// Route: Fetch all Orders
router.get('/', OrderController.getAllOrders);

// Route: Fetch Order by ID
router.get('/:id', OrderController.getOrderById);

// Route: Create a new Order
router.post('/', OrderController.createOrder);

// Route: Update an Order by ID
router.put('/:id', OrderController.updateOrderById);

// Route: Delete an Order by ID
router.delete('/:id', OrderController.deleteOrderById);

module.exports = router;
