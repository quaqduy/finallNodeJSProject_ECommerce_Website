const express = require('express');
const router = express.Router();
const OrderItemController = require('../controllers/OrderItemController');

// Route: Fetch all OrderItems
router.get('/', OrderItemController.getAllOrderItems);

// Route: Fetch OrderItem by ID
router.get('/:id', OrderItemController.getOrderItemById);

// Route: Create a new OrderItem
router.post('/', OrderItemController.createOrderItem);

// Route: Update an OrderItem by ID
router.put('/:id', OrderItemController.updateOrderItemById);

// Route: Delete an OrderItem by ID
router.delete('/:id', OrderItemController.deleteOrderItemById);

module.exports = router;
