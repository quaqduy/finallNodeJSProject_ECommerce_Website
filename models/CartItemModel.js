const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    color: { type: String, required: false }
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;
