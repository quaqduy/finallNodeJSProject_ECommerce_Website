const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo storage cho multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../public/images/product_imgs');

    // Tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Kiểm tra nếu có ảnh được upload
    if (file) {
      // Sử dụng tên sản phẩm làm tên file và đổi thành đuôi .png
      const productName = req.body.name.trim(); // Đổi khoảng trắng thành _
      const filename = `${productName}.png`;

      const uploadDir = path.join(__dirname, '../public/images/product_imgs');
      const filePath = path.join(uploadDir, filename);

      // Kiểm tra nếu file tồn tại thì xóa
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      cb(null, filename);
    } else {
      // Nếu không có ảnh thì bỏ qua phần xử lý tên file
      cb(null, null);  // Không lưu ảnh
    }
  }
});

// Kiểm tra loại file (chỉ cho phép ảnh)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
  }
};

exports.upload = multer({ storage, fileFilter });
