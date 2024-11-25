const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true },
    discountValue: { type: Number, required: true },
    expirationDate: { type: Date, required: true },
    isUsed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
