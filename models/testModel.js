const mongoose = require('mongoose');

// Định nghĩa Schema cho 'Test'
const testSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Bắt buộc phải có
    },
    description: {
        type: String,
        default: "No description provided", // Giá trị mặc định
    },
    createdAt: {
        type: Date,
        default: Date.now, // Lưu thời điểm tạo
    },
});

// Tạo Model từ Schema
const Test = mongoose.model('Test', testSchema);

// Xuất Model
module.exports = Test;
