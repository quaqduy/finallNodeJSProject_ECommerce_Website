const Address = require('../models/AddressModel');

// Fetch all Addresses
exports.getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find().populate('userId'); // Populate để lấy thông tin từ User
    res.json(addresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Fetch a single Address by ID
exports.getAddressById = async (req, res) => {
  const { id } = req.params;
  try {
    const address = await Address.findById(id).populate('userId');
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }
    res.json(address);
  } catch (error) {
    console.error('Error fetching address by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new Address
exports.createAddress = async (req, res) => {
  const { userId, fullAddress, city, state, postalCode, country } = req.body;
  const newAddress = new Address({
    userId,
    fullAddress,
    city,
    state,
    postalCode,
    country,
  });

  try {
    const savedAddress = await newAddress.save();
    res.status(201).json(savedAddress);
  } catch (error) {
    console.error('Error creating new address:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update an existing Address by ID
exports.updateAddressById = async (req, res) => {
  const { id } = req.params;
  const { userId, fullAddress, city, state, postalCode, country } = req.body;

  try {
    const updatedAddress = await Address.findByIdAndUpdate(
      id,
      { userId, fullAddress, city, state, postalCode, country },
      { new: true, runValidators: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.json(updatedAddress);
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete an Address by ID
exports.deleteAddressById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAddress = await Address.findByIdAndDelete(id);

    if (!deletedAddress) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.json({ message: 'Address deleted successfully', address: deletedAddress });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};