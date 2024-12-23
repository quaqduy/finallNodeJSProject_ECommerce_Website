const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: { type: String, required: false },
    username: { type: String, required: true },
    password: { type: String, required: true }, // Lưu mật khẩu đã mã hóa
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    role: { type: String, enum: ['customer', 'banned', 'admin'], default: 'customer' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
