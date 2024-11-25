var express = require('express');
var router = express.Router();
const Test = require('../models/testModel'); 

// GET: Fetch all Test documents
router.get('/', async function(req, res, next) {
  try {
    const tests = await Test.find(); // Lấy tất cả các document từ collection
    res.json(tests); // Trả về dữ liệu dạng JSON
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST: Create a new Test document
router.post('/', async function(req, res, next) {
  const { name, description } = req.body; // Lấy dữ liệu từ request body
  const newTest = new Test({
    name,
    description,
  });

  try {
    const savedTest = await newTest.save(); // Lưu document mới vào MongoDB
    res.status(201).json(savedTest); // Trả về document đã lưu
  } catch (error) {
    console.error('Error creating new document:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
