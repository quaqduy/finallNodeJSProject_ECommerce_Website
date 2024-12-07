const express = require('express');
const router = express.Router();
const ShippingController = require('../controllers/ShippingController');

// Route: Fetch shipping details by order ID
router.get('/:orderId', ShippingController.getShippingByOrderId);

// Route: Create new shipping details
router.post('/', ShippingController.createShipping);

// Route: Update shipping details by order ID
router.put('/:orderId', ShippingController.updateShippingByOrderId);

// Route: Delete shipping details by order ID
router.delete('/:orderId', ShippingController.deleteShippingByOrderId);

module.exports = router;
