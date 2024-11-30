const OrderItem = require('../models/OrderItemModel');

// Fetch all OrderItems
exports.getAllOrderItems = async (req, res) => {
  try {
    const orderItems = await OrderItem.find().populate('orderId').populate('productId');
    res.json(orderItems);
  } catch (error) {
    console.error('Error fetching order items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Fetch a single OrderItem by ID
exports.getOrderItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const orderItem = await OrderItem.findById(id).populate('orderId').populate('productId');
    if (!orderItem) {
      return res.status(404).json({ error: 'OrderItem not found' });
    }
    res.json(orderItem);
  } catch (error) {
    console.error('Error fetching order item by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new OrderItem
exports.createOrderItem = async (req, res) => {
  const { orderId, productId, quantity, price } = req.body;

  const newOrderItem = new OrderItem({
    orderId,
    productId,
    quantity,
    price,
  });

  try {
    const savedOrderItem = await newOrderItem.save();
    res.status(201).json(savedOrderItem);
  } catch (error) {
    console.error('Error creating new order item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update an existing OrderItem by ID
exports.updateOrderItemById = async (req, res) => {
  const { id } = req.params;
  const { orderId, productId, quantity, price } = req.body;

  try {
    const updatedOrderItem = await OrderItem.findByIdAndUpdate(
      id,
      { orderId, productId, quantity, price },
      { new: true, runValidators: true }
    );

    if (!updatedOrderItem) {
      return res.status(404).json({ error: 'OrderItem not found' });
    }

    res.json(updatedOrderItem);
  } catch (error) {
    console.error('Error updating order item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete an OrderItem by ID
exports.deleteOrderItemById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOrderItem = await OrderItem.findByIdAndDelete(id);

    if (!deletedOrderItem) {
      return res.status(404).json({ error: 'OrderItem not found' });
    }

    res.json({ message: 'OrderItem deleted successfully', orderItem: deletedOrderItem });
  } catch (error) {
    console.error('Error deleting order item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
