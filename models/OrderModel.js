const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderStatus: { 
        type: String, 
        enum: ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'], 
        default: 'pending' 
    },
    totalPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
