const CartItem = require('../models/CartItemModel');

// Fetch all Cart Items
exports.getAllCartItems = async (req, res) => {
  try {
    const cartItems = await CartItem.find().populate('cartId productId'); // Populate cart và product để lấy thông tin liên quan
    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Fetch Cart Items by Cart ID
exports.getCartItemsByCartId = async (req, res) => {
  const { cartId } = req.params;
  try {
    const cartItems = await CartItem.find({ cartId }).populate('productId');
    if (!cartItems || cartItems.length === 0) {
      return res.status(404).json({ error: 'No items found for this cart' });
    }
    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items by cart ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Add a new Cart Item
exports.createCartItem = async (req, res) => {
  console.log(req.body)
  const { cartId, productId, quantity } = req.body;

  const newCartItem = new CartItem({
    cartId,
    productId,
    quantity,
    color
  });

  try {
    const savedCartItem = await newCartItem.save();
    res.status(201).json(savedCartItem);
  } catch (error) {
    console.error('Error creating new cart item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update an existing Cart Item by ID
exports.updateCartItemById = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const updatedCartItem = await CartItem.findByIdAndUpdate(
      id,
      { quantity },
      { new: true, runValidators: true }
    );

    if (!updatedCartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json(updatedCartItem);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a Cart Item by ID
exports.deleteCartItemById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCartItem = await CartItem.findByIdAndDelete(id);

    if (!deletedCartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Cart item deleted successfully', cartItem: deletedCartItem });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
