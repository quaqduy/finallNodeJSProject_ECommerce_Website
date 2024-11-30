const Shipping = require('../models/ShippingModel');

// Fetch shipping details by order ID
exports.getShippingByOrderId = async (req, res) => {
  const { orderId } = req.params;
  try {
    const shipping = await Shipping.findOne({ orderId }).populate('orderId', 'totalPrice userId');
    if (!shipping) {
      return res.status(404).json({ error: 'Shipping details not found' });
    }
    res.json(shipping);
  } catch (error) {
    console.error('Error fetching shipping details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create new shipping details
exports.createShipping = async (req, res) => {
  const { orderId, shippingMethod, shippingCost, trackingNumber } = req.body;

  const newShipping = new Shipping({
    orderId,
    shippingMethod,
    shippingCost,
    trackingNumber,
  });

  try {
    const savedShipping = await newShipping.save();
    res.status(201).json(savedShipping);
  } catch (error) {
    console.error('Error creating shipping details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update shipping details by order ID
exports.updateShippingByOrderId = async (req, res) => {
  const { orderId } = req.params;
  const { shippingMethod, shippingCost, trackingNumber } = req.body;

  try {
    const updatedShipping = await Shipping.findOneAndUpdate(
      { orderId },
      { shippingMethod, shippingCost, trackingNumber, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedShipping) {
      return res.status(404).json({ error: 'Shipping details not found' });
    }

    res.json(updatedShipping);
  } catch (error) {
    console.error('Error updating shipping details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete shipping details by order ID
exports.deleteShippingByOrderId = async (req, res) => {
  const { orderId } = req.params;

  try {
    const deletedShipping = await Shipping.findOneAndDelete({ orderId });

    if (!deletedShipping) {
      return res.status(404).json({ error: 'Shipping details not found' });
    }

    res.json({ message: 'Shipping details deleted successfully', shipping: deletedShipping });
  } catch (error) {
    console.error('Error deleting shipping details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
