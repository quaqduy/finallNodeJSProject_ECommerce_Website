const Coupon = require('../models/CouponModel');

// Fetch all Coupons
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Fetch a single Coupon by ID
exports.getCouponById = async (req, res) => {
  const { id } = req.params;
  try {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }
    res.json(coupon);
  } catch (error) {
    console.error('Error fetching coupon by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new Coupon
exports.createCoupon = async (req, res) => {
  const { code, discountValue, expirationDate } = req.body;

  const newCoupon = new Coupon({
    code,
    discountValue,
    expirationDate,
  });

  try {
    const savedCoupon = await newCoupon.save();
    res.status(201).json(savedCoupon);
  } catch (error) {
    console.error('Error creating new coupon:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update an existing Coupon by ID
exports.updateCouponById = async (req, res) => {
  const { id } = req.params;
  const { code, discountValue, expirationDate, isUsed } = req.body;

  try {
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      { code, discountValue, expirationDate, isUsed, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    res.json(updatedCoupon);
  } catch (error) {
    console.error('Error updating coupon:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a Coupon by ID
exports.deleteCouponById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(id);

    if (!deletedCoupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    res.json({ message: 'Coupon deleted successfully', coupon: deletedCoupon });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
