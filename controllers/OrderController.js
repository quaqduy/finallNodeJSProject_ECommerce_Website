const Order = require('../models/OrderModel');

// Fetch all Orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId'); // Populate user info
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Fetch a single Order by ID
exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id).populate('userId');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new Order
exports.createOrder = async (req, res) => {
  const { userId, orderStatus, totalPrice, discount } = req.body;

  const newOrder = new Order({
    userId,
    orderStatus,
    totalPrice,
    discount,
  });

  try {
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating new order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update an existing Order by ID
exports.updateOrderById = async (req, res) => {
  const { id } = req.params;
  const { orderStatus, totalPrice, discount } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { orderStatus, totalPrice, discount, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete an Order by ID
exports.deleteOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully', order: deletedOrder });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
