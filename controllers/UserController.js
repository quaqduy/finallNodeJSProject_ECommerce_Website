const bcrypt = require('bcrypt');
const User = require('../models/UserModel');

// Fetch all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Fetch user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  const { username, password, email, phoneNumber, role } = req.body;

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    password: hashedPassword,
    email,
    phoneNumber,
    role,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating new user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update user by ID
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password, email, phoneNumber, role } = req.body;

  // Hash the new password if provided
  let updatedData = { username, email, phoneNumber, role };
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updatedData.password = hashedPassword;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
