const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// Route: Get all users
router.get('/', UserController.getAllUsers);

// Route: Get a user by ID
router.get('/:id', UserController.getUserById);

// Route: Create a new user
router.post('/', UserController.createUser);

// Route: Update user by ID
router.put('/:id', UserController.updateUser);

// Route: Delete user by ID
router.delete('/:id', UserController.deleteUser);

module.exports = router;
