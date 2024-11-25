const mongoose = require('mongoose');

const shippingSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    shippingMethod: { type: String, enum: ['standard', 'express'], required: true },
    shippingCost: { type: Number, required: true },
    trackingNumber: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Shipping = mongoose.model('Shipping', shippingSchema);

module.exports = Shipping;
