const Cart = require('../models/CartModel');

// Fetch all Carts
exports.getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find().populate('userId'); // Populate user để lấy thông tin chi tiết
    res.json(carts);
  } catch (error) {
    console.error('Error fetching carts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Fetch Cart by ID
exports.getCartById = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await Cart.findById(id).populate('userId');
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new Cart
exports.createCart = async (req, res) => {
  const { userId } = req.body;

  const newCart = new Cart({
    userId,
  });

  try {
    const savedCart = await newCart.save();
    res.status(201).json(savedCart);
  } catch (error) {
    console.error('Error creating new cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update an existing Cart by ID
exports.updateCartById = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      id,
      { userId, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    res.json(updatedCart);
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a Cart by ID
exports.deleteCartById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCart = await Cart.findByIdAndDelete(id);

    if (!deletedCart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    res.json({ message: 'Cart deleted successfully', cart: deletedCart });
  } catch (error) {
    console.error('Error deleting cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
