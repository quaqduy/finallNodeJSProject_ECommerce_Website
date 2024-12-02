const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
    wishlistId: { type: mongoose.Schema.Types.ObjectId, ref: 'wishlist', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
});

const WishlistItem = mongoose.model('WishlistItem', wishlistItemSchema);

module.exports = WishlistItem;
