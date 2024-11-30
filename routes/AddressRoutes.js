const express = require('express');
const router = express.Router();
const AddressController = require('../controllers/AddressController');

// Route: Fetch all Addresses
router.get('/', AddressController.getAllAddresses);

// Route: Fetch a single Address by ID
router.get('/:id', AddressController.getAddressById);

// Route: Create a new Address
router.post('/', AddressController.createAddress);

// Route: Update an existing Address by ID
router.put('/:id', AddressController.updateAddressById);

// Route: Delete an Address by ID
router.delete('/:id', AddressController.deleteAddressById);

module.exports = router;
