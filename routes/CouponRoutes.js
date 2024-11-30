const express = require('express');
const router = express.Router();
const CouponController = require('../controllers/CouponController');

// Route: Fetch all Coupons
router.get('/', CouponController.getAllCoupons);

// Route: Fetch Coupon by ID
router.get('/:id', CouponController.getCouponById);

// Route: Create a new Coupon
router.post('/', CouponController.createCoupon);

// Route: Update a Coupon by ID
router.put('/:id', CouponController.updateCouponById);

// Route: Delete a Coupon by ID
router.delete('/:id', CouponController.deleteCouponById);

module.exports = router;
