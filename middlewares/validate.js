const validator = require('validator');

// Middleware kiểm tra dữ liệu đăng ký
const validateRegistration = (req, res, next) => {
    const { username, phoneNumber, email, password, repassword } = req.body;
    // Nếu không có lỗi, xóa lỗi trong session và tiếp tục xử lý
    req.session.registerErr = [];
    req.session.oldDataFormRegister = { username, phoneNumber, email, password, repassword };

    // Sử dụng trim() để loại bỏ khoảng trắng
    const trimmedData = {
        username: username?.trim() || "",
        phoneNumber: phoneNumber?.trim() || "",
        email: email?.trim() || "",
        password: password?.trim() || "",
        repassword: repassword?.trim() || "",
    };

    // Danh sách lỗi
    const errors = [];

    // Kiểm tra các trường bắt buộc
    if (!trimmedData.username) {
        errors.push("Username is required.");
    } else if (trimmedData.username === "Guess") {
        errors.push("You must enter your new username.");
    } else if (!validator.isLength(trimmedData.username, { min: 3, max: 20 })) {
        errors.push("Username must be between 3 and 20 characters.");
    }

    if (!trimmedData.phoneNumber) {
        errors.push("Phone number is required.");
    } else if (!validator.isMobilePhone(trimmedData.phoneNumber, "vi-VN")) {
        errors.push("Invalid phone number.");
    }

    if (!trimmedData.email) {
        errors.push("Email address is required.");
    }else if(trimmedData.email === 'none@none.com'){
        errors.push("You must enter your new email.");
    } 
    else if (!validator.isEmail(trimmedData.email)) {
        errors.push("Invalid email address.");
    }

    if (!trimmedData.password) {
        errors.push("Password is required.");
    } else if (!validator.isLength(trimmedData.password, { min: 8 })) {
        errors.push("Password must be at least 8 characters long.");
    }

    if (trimmedData.password !== trimmedData.repassword) {
        errors.push("Passwords do not match.");
    }

    // Nếu có lỗi, lưu vào session và chuyển hướng
    if (errors.length > 0) {
        req.session.registerErr = errors;
        return res.redirect('/login'); // Hoặc route khác phù hợp
    }

    next();
};

module.exports = {
    validateRegistration,
};
