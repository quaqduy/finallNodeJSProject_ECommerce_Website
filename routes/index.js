var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");

const Category = require("../models/CategoryModel");
const Product = require("../models/ProductModel");
const User = require("../models/UserModel");
const Cart = require("../models/CartModel");
const CartItem = require("../models/CartItemModel");
const Wishlist = require("../models/wishListModel");
const WishlistItem = require("../models/wishListItemModel");
const Address = require("../models/AddressModel");
const Order = require("../models/OrderModel");
const OrderItem = require("../models/OrderItemModel");
const Shipping = require("../models/ShippingModel");
const Review = require("../models/ReviewModel");
const multer = require("multer");
const path = require("path");
const moment = require('moment');

// Cấu hình multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/product_imgs"); // Thư mục lưu trữ hình ảnh
  },
  filename: function (req, file, cb) {
    cb(null, req.body.name.trim() + path.extname(file.originalname)); // Đặt tên file trùng với tên sản phẩm
  },
});

const upload = multer({ storage: storage });

/* GET home page. */
router.get("/", async function (req, res, next) {
  if (!req.session.user) {
    //Create new account for guess
    const newUser = new User({
      username: "Guess",
      password: await bcrypt.hash("123456", 10),
      email: "none@none.com",
      phoneNumber: "none",
    });
    const savedUser = await newUser.save();
    req.session.user = { userId: savedUser.id };
    req.session.userInf = savedUser;

    //Create new cart for new user
    const newCart = new Cart({
      userId: savedUser.id,
    });
    const savedCart = await newCart.save();
    req.session.cart = { cartId: savedCart.id };

    //Create new wishlist for new user
    const newWishlist = new Wishlist({
      userId: savedUser.id,
    });
    const savedWishlist = await newWishlist.save();
    req.session.wishlist = { wishlistId: savedWishlist.id };
  }

  console.log(req.session.user.userId);
  console.log(req.session.userInf.username);
  console.log(req.session.cart);

  //get cartItem list
  const cartId_find_items = req.session.cart.cartId;
  const cartItems = await CartItem.find({ cartId: cartId_find_items }).populate(
    "productId"
  );
  req.session.cartItemList = cartItems;
  const cartItemList = req.session.cartItemList;

  //get wishlist item list
  const wishlistId_find_items = req.session.wishlist.wishlistId;
  const wishlistItems = await WishlistItem.find({
    wishlistId: wishlistId_find_items,
  }).populate("productId");
  req.session.wishlistItemList = wishlistItems;
  const wishlistItemList = req.session.wishlistItemList;

  //Ready for view
  const categories = await Category.find();
  const products = await Product.find().populate("categoryId");

  //for hot deal
  const lsProductSelled = await OrderItem.find().populate("productId"); // Lấy danh sách với thông tin productId
  // Gom nhóm các sản phẩm theo productId và cộng dồn quantity
  const aggregatedProducts = lsProductSelled.reduce((acc, item) => {
    // Kiểm tra nếu productId hoặc productId._id không tồn tại
    if (!item.productId || !item.productId._id) {
      console.warn('Invalid item, missing productId or _id:', item);
      return acc; // Bỏ qua item không hợp lệ
    }
  
    // Tìm sản phẩm đã tồn tại trong danh sách acc
    const existingItem = acc.find(
      (prod) => prod.productId._id.toString() === item.productId._id.toString()
    );
  
    if (existingItem) {
      // Cộng dồn quantity nếu sản phẩm đã tồn tại
      existingItem.quantity += item.quantity;
    } else {
      // Thêm sản phẩm mới vào danh sách
      acc.push({
        productId: item.productId,
        quantity: item.quantity,
      });
    }
  
    return acc; // Trả về acc để tiếp tục reduce
  }, []);
  
  // Sắp xếp theo quantity giảm dần
  aggregatedProducts.sort((a, b) => b.quantity - a.quantity);
  // Lấy top 10 sản phẩm (hoặc tất cả nếu ít hơn 10)
  const topProducts = aggregatedProducts.slice(0, 10);

  const webLocationHost = `${req.protocol}://${req.get("host")}`;
  res.render("homePage", {
    title: "Home Page",
    webLocationHost,
    categories,
    products,
    cartItemList,
    cartId: req.session.cart.cartId,
    wishlistId: req.session.wishlist.wishlistId,
    wishlistItemList,
    userInf: req.session.userInf,
    topProducts,
  });
});

/* GET shop page. */
router.get("/shop", async function (req, res, next) {
  if (!req.session.user) {
    res.redirect("/");
  } else {
    const categories = await Category.find();
    const products = await Product.find().populate("categoryId");

    const cartId = req.session.cart.cartId;
    const webLocationHost = `${req.protocol}://${req.get("host")}`;

    //get cartItem list
    const cartId_find_items = req.session.cart.cartId;
    const cartItems = await CartItem.find({
      cartId: cartId_find_items,
    }).populate("productId");
    req.session.cartItemList = cartItems;
    const cartItemList = req.session.cartItemList;

    //get wishlist item list
    const wishlistId_find_items = req.session.wishlist.wishlistId;
    const wishlistItems = await WishlistItem.find({
      wishlistId: wishlistId_find_items,
    }).populate("productId");
    req.session.wishlistItemList = wishlistItems;
    const wishlistItemList = req.session.wishlistItemList;

    res.render("shop", {
      title: "Shop",
      webLocationHost,
      categories,
      products,
      categoryName: "",
      cartId,
      cartItemList,
      wishlistId: req.session.wishlist.wishlistId,
      wishlistItemList: wishlistItemList,
      userInf: req.session.userInf,
    });
  }
});

/* GET shop page by type category. */
router.get("/shop/:id", async function (req, res, next) {
  if (!req.session.user) {
    res.redirect("/");
  } else {
    const { id } = req.params;

    const categories = await Category.find();
    let categoryName = "";
    categories.forEach((item) => {
      if (item.id == id) {
        categoryName = item.name;
      }
    });

    const products = await Product.find({ categoryId: id });

    const webLocationHost = `${req.protocol}://${req.get("host")}`;
    const cartId = req.session.cart.cartId;

    //get cartItem list
    const cartId_find_items = req.session.cart.cartId;
    const cartItems = await CartItem.find({
      cartId: cartId_find_items,
    }).populate("productId");
    req.session.cartItemList = cartItems;
    const cartItemList = req.session.cartItemList;

    //get wishlist item list
    const wishlistId_find_items = req.session.wishlist.wishlistId;
    const wishlistItems = await WishlistItem.find({
      wishlistId: wishlistId_find_items,
    }).populate("productId");
    req.session.wishlistItemList = wishlistItems;
    const wishlistItemList = req.session.wishlistItemList;

    res.render("shop", {
      title: "Shop",
      webLocationHost,
      categories,
      products,
      categoryName,
      cartId,
      cartItemList,
      wishlistId: req.session.wishlist.wishlistId,
      wishlistItemList: req.session.wishlistItemList,
      userInf: req.session.userInf,
    });
  }
});

//DELETE cart item
router.post("/cart_item/:id", async function (req, res, next) {
  const deletedCartItem = await CartItem.findByIdAndDelete(req.params.id);
  res.redirect(req.body.windowLocation);
});

//DELETE many cart item
router.post("/cart_item_delmany", async function (req, res, next) {
  console.log(req.body);
  if (req.body.listCartItemID_remove !== "") {
    const listCartItemRemove = req.body.listCartItemID_remove.split(";");
    if (listCartItemRemove.length > 0 && listCartItemRemove) {
      listCartItemRemove.forEach(async (item) => {
        await CartItem.findByIdAndDelete(item);
      });
    }
  }
  if (req.body.listQuantity_change !== "") {
    const listQuantity_change = JSON.parse(req.body.listQuantity_change);
    console.log(listQuantity_change);
    if (listQuantity_change.length > 0) {
      listQuantity_change.forEach(async (item) => {
        const updatedCartItem = await CartItem.findById(item.cartItemID);
        updatedCartItem.quantity = item.quantity;
        await updatedCartItem.save();
      });
    }
  }
  res.redirect(req.body.currentURL);
});

//add cart item
router.post("/cart_item", async function (req, res, next) {
  const { cartId, productId, color, quantity, currentURL } = req.body;

  try {
    // Check if the CartItem already exists with the provided cartId and productId
    const existingCartItem = await CartItem.findOne({ cartId, productId });

    if (existingCartItem) {
      // If the CartItem exists, update the quantity by adding the new quantity
      existingCartItem.quantity += parseInt(quantity, 10);

      // Check if the CartItem already has a color
      if (existingCartItem.color) {
        // If colors exist, split them and check if the new color is already included
        const existingColors = existingCartItem.color
          .split(",")
          .map((col) => col.trim());
        if (!existingColors.includes(color)) {
          // If the color is not in the list, add the new color (separated by a comma)
          existingCartItem.color = existingCartItem.color + "," + color;
        }
      } else {
        // If no color exists, set the color field to the new color
        existingCartItem.color = color;
      }

      // Save the updated CartItem
      await existingCartItem.save();
    } else {
      // If the CartItem does not exist, create a new one
      const newCartItem = new CartItem({
        cartId,
        productId,
        quantity,
        color,
      });
      // Save the new CartItem
      await newCartItem.save();
    }

    // Redirect to the provided currentURL
    res.redirect(currentURL);
  } catch (error) {
    console.error("Error adding/updating cart item:", error);
    // Return an error response in case of an exception
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* GET cart page. */
router.get("/cart", async function (req, res, next) {
  if (!req.session.user) {
    res.redirect("/");
  } else {
    const { id } = req.params;

    const categories = await Category.find();
    let categoryName = "";
    categories.forEach((item) => {
      if (item.id == id) {
        categoryName = item.name;
      }
    });

    const webLocationHost = `${req.protocol}://${req.get("host")}`;
    const cartId = req.session.cart.cartId;

    //get cartItem list
    const cartId_find_items = req.session.cart.cartId;
    const cartItems = await CartItem.find({
      cartId: cartId_find_items,
    }).populate("productId");
    req.session.cartItemList = cartItems;
    const cartItemList = req.session.cartItemList;

    //get wishlist item list
    const wishlistId_find_items = req.session.wishlist.wishlistId;
    const wishlistItems = await WishlistItem.find({
      wishlistId: wishlistId_find_items,
    }).populate("productId");
    req.session.wishlistItemList = wishlistItems;
    const wishlistItemList = req.session.wishlistItemList;

    //products
    const products = await Product.find().populate("categoryId");

    res.render("cart", {
      title: "Cart",
      webLocationHost,
      categories,
      categoryName,
      cartId,
      cartItemList,
      wishlistId: req.session.wishlist.wishlistId,
      wishlistItemList: req.session.wishlistItemList,
      products,
      userInf: req.session.userInf,
    });
  }
});

/* GET product detail page. */
router.get("/product-details/:id", async function (req, res, next) {
  if (!req.session.user) {
    res.redirect("/");
  } else {
    const { id } = req.params;

    const categories = await Category.find();
    let categoryName = "";
    categories.forEach((item) => {
      if (item.id == id) {
        categoryName = item.name;
      }
    });

    const webLocationHost = `${req.protocol}://${req.get("host")}`;
    const cartId = req.session.cart.cartId;

    //get cartItem list
    const cartId_find_items = req.session.cart.cartId;
    const cartItems = await CartItem.find({
      cartId: cartId_find_items,
    }).populate("productId");
    req.session.cartItemList = cartItems;
    const cartItemList = req.session.cartItemList;

    //get wishlist item list
    const wishlistId_find_items = req.session.wishlist.wishlistId;
    const wishlistItems = await WishlistItem.find({
      wishlistId: wishlistId_find_items,
    }).populate("productId");
    req.session.wishlistItemList = wishlistItems;
    const wishlistItemList = req.session.wishlistItemList;

    //For product Detail
    const productDetail = await Product.findById(id).populate("categoryId");
    //product
    const products = await Product.find().populate("categoryId");

    //review
    const reviewLs = await Review.find({ productId: id });
    console.log(reviewLs);
    res.render("product-details", {
      title: "Product Detail",
      webLocationHost,
      categories,
      categoryName,
      cartId,
      cartItemList,
      productDetail,
      wishlistId: req.session.wishlist.wishlistId,
      wishlistItemList: req.session.wishlistItemList,
      products,
      userInf: req.session.userInf,
      reviewLs,
    });
  }
});

/* GET wishlist page. */
router.get("/wishlist", async function (req, res, next) {
  try {
    if (!req.session.user) {
      res.redirect("/");
    } else {
      const { id } = req.params;

      const categories = await Category.find();
      let categoryName = "";
      categories.forEach((item) => {
        if (item.id == id) {
          categoryName = item.name;
        }
      });

      const webLocationHost = `${req.protocol}://${req.get("host")}`;
      const cartId = req.session.cart.cartId;

      //get cartItem list
      const cartId_find_items = req.session.cart.cartId;
      const cartItems = await CartItem.find({
        cartId: cartId_find_items,
      }).populate("productId");
      req.session.cartItemList = cartItems;
      const cartItemList = req.session.cartItemList;

      //get wishlist item list
      const wishlistId_find_items = req.session.wishlist.wishlistId;
      const wishlistItems = await WishlistItem.find({
        wishlistId: wishlistId_find_items,
      }).populate("productId");
      req.session.wishlistItemList = wishlistItems;
      const wishlistItemList = req.session.wishlistItemList;

      //For product Detail
      const productDetail = await Product.findById(id).populate("categoryId");

      //products
      const products = await Product.find().populate("categoryId");

      res.render("wishlist", {
        title: "Wishlist",
        webLocationHost,
        categories,
        categoryName,
        cartId,
        cartItemList,
        productDetail,
        wishlistId: req.session.wishlist.wishlistId,
        wishlistItemList: req.session.wishlistItemList,
        products,
        userInf: req.session.userInf,
      });
    }
  } catch (e) {
    console.log(e); // Log the error object
  }
});

// Create/Delete itemWishlist
router.post("/wishlist_item", async function (req, res, next) {
  const { wishlistId, productId, currentUrl } = req.body;

  try {
    // Check if the product already exists in the wishlist
    const existingWishlistItem = await WishlistItem.findOne({
      wishlistId,
      productId,
    });

    if (existingWishlistItem) {
      // If the item already exists, delete the item from the wishlist
      await WishlistItem.deleteOne({ _id: existingWishlistItem._id });
      console.log("Wishlist item deleted");
      return res.redirect(currentUrl); // Redirect back after deletion
    }

    // If the item doesn't exist, create a new WishlistItem
    const newWishlistItem = new WishlistItem({
      wishlistId,
      productId,
    });
    await newWishlistItem.save();

    // After saving, redirect the user
    res.redirect(currentUrl);
  } catch (error) {
    console.error("Error creating/deleting wishlist item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* GET about page. */
router.get("/about", async function (req, res, next) {
  if (!req.session.user) {
    res.redirect("/");
  } else {
    const { id } = req.params;

    const categories = await Category.find();
    let categoryName = "";
    categories.forEach((item) => {
      if (item.id == id) {
        categoryName = item.name;
      }
    });

    const webLocationHost = `${req.protocol}://${req.get("host")}`;
    const cartId = req.session.cart.cartId;

    //get cartItem list
    const cartId_find_items = req.session.cart.cartId;
    const cartItems = await CartItem.find({
      cartId: cartId_find_items,
    }).populate("productId");
    req.session.cartItemList = cartItems;
    const cartItemList = req.session.cartItemList;

    //get wishlist item list
    const wishlistId_find_items = req.session.wishlist.wishlistId;
    const wishlistItems = await WishlistItem.find({
      wishlistId: wishlistId_find_items,
    }).populate("productId");
    req.session.wishlistItemList = wishlistItems;
    const wishlistItemList = req.session.wishlistItemList;

    //products
    const products = await Product.find().populate("categoryId");

    res.render("about", {
      title: "About",
      webLocationHost,
      categories,
      categoryName,
      cartId,
      cartItemList,
      wishlistId: req.session.wishlist.wishlistId,
      wishlistItemList: req.session.wishlistItemList,
      products,
      userInf: req.session.userInf,
    });
  }
});

/* GET contact page. */
router.get("/contact", async function (req, res, next) {
  if (!req.session.user) {
    res.redirect("/");
  } else {
    const { id } = req.params;

    const categories = await Category.find();
    let categoryName = "";
    categories.forEach((item) => {
      if (item.id == id) {
        categoryName = item.name;
      }
    });

    const webLocationHost = `${req.protocol}://${req.get("host")}`;
    const cartId = req.session.cart.cartId;

    //get cartItem list
    const cartId_find_items = req.session.cart.cartId;
    const cartItems = await CartItem.find({
      cartId: cartId_find_items,
    }).populate("productId");
    req.session.cartItemList = cartItems;
    const cartItemList = req.session.cartItemList;

    //get wishlist item list
    const wishlistId_find_items = req.session.wishlist.wishlistId;
    const wishlistItems = await WishlistItem.find({
      wishlistId: wishlistId_find_items,
    }).populate("productId");
    req.session.wishlistItemList = wishlistItems;
    const wishlistItemList = req.session.wishlistItemList;

    //products
    const products = await Product.find().populate("categoryId");

    res.render("contact", {
      title: "Contact",
      webLocationHost,
      categories,
      categoryName,
      cartId,
      cartItemList,
      wishlistId: req.session.wishlist.wishlistId,
      wishlistItemList: req.session.wishlistItemList,
      products,
      userInf: req.session.userInf,
    });
  }
});

/* GET login page. */
router.get("/login", async function (req, res, next) {
  if (!req.session.user) {
    res.redirect("/");
  } else {
    const { id } = req.params;

    const categories = await Category.find();
    let categoryName = "";
    categories.forEach((item) => {
      if (item.id == id) {
        categoryName = item.name;
      }
    });

    const webLocationHost = `${req.protocol}://${req.get("host")}`;
    const cartId = req.session.cart.cartId;

    //get cartItem list
    const cartId_find_items = req.session.cart.cartId;
    const cartItems = await CartItem.find({
      cartId: cartId_find_items,
    }).populate("productId");
    req.session.cartItemList = cartItems;
    const cartItemList = req.session.cartItemList;

    //get wishlist item list
    const wishlistId_find_items = req.session.wishlist.wishlistId;
    const wishlistItems = await WishlistItem.find({
      wishlistId: wishlistId_find_items,
    }).populate("productId");
    req.session.wishlistItemList = wishlistItems;
    const wishlistItemList = req.session.wishlistItemList;

    //products
    const products = await Product.find().populate("categoryId");

    const userInf = req.session.userInf;

    res.render("login", {
      title: "Login",
      webLocationHost,
      categories,
      categoryName,
      cartId,
      cartItemList,
      wishlistId: req.session.wishlist.wishlistId,
      wishlistItemList: req.session.wishlistItemList,
      products,
      userInf,
      errorRegister: req.session.registerErr,
      oldDataFormRegister: req.session.oldDataFormRegister,
      errorSign: req.session.signInErr,
      oldDataFormSignIn: req.session.oldDataFormSignIn,
    });
  }
});

//Register
const { validateRegistration } = require("../middlewares/validate");
router.post("/login/register", validateRegistration, async (req, res) => {
  req.session.oldDataFormRegister = null;
  req.session.registerErr = { code: "0", msg: "Success to create account." };

  const { fullname, username, email, phoneNumber, password } = req.body;

  let updatedData = { fullname, username, email, phoneNumber, password };
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updatedData.password = hashedPassword;
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.session.user.userId,
    updatedData,
    { new: true, runValidators: true }
  );
  req.session.userInf = updatedUser;

  res.redirect("/userAccount");
});

//signIn
const { validateSignIn } = require("../middlewares/validateSignIn");
router.post("/login/signIn", validateSignIn, async (req, res) => {
  // Xóa dữ liệu cũ nếu có
  req.session.oldDataFormSignIn = null;
  req.session.signInErr = null;

  // Lấy dữ liệu từ form
  const { usernameOrEmail, password } = req.body;
  // Kiểm tra xem người dùng có đăng nhập bằng username hay email
  const user = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  });

  if (!user) {
    // Nếu không tìm thấy người dùng
    req.session.signInErr = { code: "1", msg: "Invalid username or email." };
    req.session.oldDataFormSignIn = req.body;
    return res.redirect("/login"); // Quay lại trang login với thông báo lỗi
  }

  // Kiểm tra mật khẩu
  const isMatch = await bcrypt.compare(password, user.password);
  console.log(isMatch);
  if (!isMatch) {
    // Nếu mật khẩu không đúng
    req.session.signInErr = { code: "2", msg: "Incorrect password." };
    req.session.oldDataFormSignIn = req.body;
    return res.redirect("/login"); // Quay lại trang login với thông báo lỗi
  }
  // Đăng nhập thành công, lưu thông tin người dùng vào session
  req.session.userInf = user;
  req.session.user = { userId: user.id };

  if (user.role == "admin") {
    res.redirect("/admins/dashboard"); // Redirect đến trang tài khoản admin
  } else {
    const cart = await Cart.findOne({ userId: user._id });
    req.session.cart = { cartId: cart._id };

    const wishlist = await Wishlist.findOne({ userId: user._id });
    req.session.wishlist = { wishlistId: wishlist._id };

    res.redirect("/userAccount"); // Redirect đến trang tài khoản người dùng
  }
});

/* GET user account page. */
router.get("/userAccount", async function (req, res, next) {
  if (
    !req.session.user ||
    (req.session.userInf && req.session.userInf.username === "Guess")
  ) {
    res.redirect("/");
  } else {
    const id = req.session.userInf._id;

    const categories = await Category.find();
    let categoryName = "";
    categories.forEach((item) => {
      if (item.id == id) {
        categoryName = item.name;
      }
    });

    const webLocationHost = `${req.protocol}://${req.get("host")}`;
    const cartId = req.session.cart.cartId;

    //get cartItem list
    const cartId_find_items = req.session.cart.cartId;
    const cartItems = await CartItem.find({
      cartId: cartId_find_items,
    }).populate("productId");
    req.session.cartItemList = cartItems;
    const cartItemList = req.session.cartItemList;

    //get wishlist item list
    const wishlistId_find_items = req.session.wishlist.wishlistId;
    const wishlistItems = await WishlistItem.find({
      wishlistId: wishlistId_find_items,
    }).populate("productId");
    req.session.wishlistItemList = wishlistItems;
    const wishlistItemList = req.session.wishlistItemList;

    //products
    const products = await Product.find().populate("categoryId");

    const userInf = req.session.userInf;

    //Address
    const addressLs = await Address.find({ userId: id });

    //Orders
    const OrderLs = await Order.find({ userId: id });

    res.render("userAccount", {
      title: "User Account",
      webLocationHost,
      categories,
      categoryName,
      cartId,
      cartItemList,
      wishlistId: req.session.wishlist.wishlistId,
      wishlistItemList: req.session.wishlistItemList,
      products,
      userInf,
      errorRegister: req.session.registerErr,
      oldDataFormRegister: req.session.oldDataFormRegister,
      addressLs,
      OrderLs,
    });
  }
});

//Logout
router.get("/logout", async (req, res) => {
  req.session.oldDataFormRegister = null;
  req.session.registerErr = {};

  req.session.userInf = null;
  req.session.user = null;

  res.redirect("/");
});

//For forgot pass
router.get("/forgortpassword", async (req, res) => {
  res.render("forgotPass", { result: {} });
});

const mailer = require("../helper/mailer");
router.post("/forgortpassword", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  let result = {
    code: 1,
    message: "User not found with the provided email address.",
  };
  if (user) {
    const newPassword = user.username + "@@1";

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    mailer.mailerCreate(email, newPassword, user.fullname);

    result = {
      code: 0,
      message:
        "Password reset successfully. Check your email for the new password.",
    };
  }

  res.render("forgotPass", { result });
});

//for checkout
router.get("/checkout", async function (req, res, next) {
  if (!req.session.user) {
    res.redirect("/");
  } else {
    const { id } = req.params;

    const categories = await Category.find();
    let categoryName = "";
    categories.forEach((item) => {
      if (item.id == id) {
        categoryName = item.name;
      }
    });

    const webLocationHost = `${req.protocol}://${req.get("host")}`;
    const cartId = req.session.cart.cartId;

    //get cartItem list
    const cartId_find_items = req.session.cart.cartId;
    const cartItems = await CartItem.find({
      cartId: cartId_find_items,
    }).populate("productId");
    req.session.cartItemList = cartItems;
    const cartItemList = req.session.cartItemList;

    //get wishlist item list
    const wishlistId_find_items = req.session.wishlist.wishlistId;
    const wishlistItems = await WishlistItem.find({
      wishlistId: wishlistId_find_items,
    }).populate("productId");
    req.session.wishlistItemList = wishlistItems;
    const wishlistItemList = req.session.wishlistItemList;

    //products
    const products = await Product.find().populate("categoryId");

    const userInf = req.session.userInf;

    //getAddress if userHave account
    const addressUserList = await Address.find({
      userId: req.session.user.userId,
    });
    console.log(addressUserList);

    res.render("checkout", {
      title: "Checkout",
      webLocationHost,
      categories,
      categoryName,
      cartId,
      cartItemList,
      wishlistId: req.session.wishlist.wishlistId,
      wishlistItemList: req.session.wishlistItemList,
      products,
      userInf,
      errorRegister: req.session.registerErr,
      oldDataFormRegister: req.session.oldDataFormRegister,
      addressUserList,
    });
  }
});

const mailerOrder = require("../helper/mailerOrder");
router.post("/checkout", async (req, res) => {
  try {
    const {
      fullname,
      state,
      fullAddress,
      city,
      phoneNumber,
      email,
      shippingCost,
      shippingMethod,
      totalPrice,
      discount,
      username,
      password,
      checkRegister,
    } = req.body;

    // 1. Save order information to the Order table
    const newOrder = new Order({
      userId: req.session.user.userId,
      totalPrice,
      discount,
    });
    const savedOrder = await newOrder.save();
    const newOrderId = savedOrder._id;

    // 2. Save items to the OrderItem table
    const cartItemList = req.session.cartItemList || [];
    for (const itemCart of cartItemList) {
      const newOrderItem = new OrderItem({
        orderId: newOrderId,
        productId: itemCart.productId._id,
        quantity: itemCart.quantity,
        price: itemCart.quantity * itemCart.productId.price,
      });
      await newOrderItem.save();
    }

    // 3. Update product stock in the Product table
    for (const itemCart of cartItemList) {
      const product = await Product.findById(itemCart.productId._id);
      const newStock = product.stock - itemCart.quantity;
      product.stock = newStock;
      await product.save();
    }

    // 4. Save shipping information to the Shipping table
    const trackingNumber = generateTrackingNumber();
    const newShipping = new Shipping({
      orderId: newOrderId,
      shippingMethod,
      shippingCost,
      trackingNumber,
    });
    await newShipping.save();

    // 5. Clear the cart after completing the order
    for (const cartItem of req.session.cartItemList) {
      await CartItem.deleteOne({ _id: cartItem._id });
    }

    // 6. register account if user chosing register
    if (checkRegister == "on") {
      let updatedData = { fullname, username, email, phoneNumber, password };
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updatedData.password = hashedPassword;
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.session.user.userId,
        updatedData,
        { new: true, runValidators: true }
      );
      req.session.userInf = updatedUser;

      //Create Address for user
      const userAddress = new Address({
        userId: req.session.user.userId,
        fullAddress,
        city,
        state,
        default: true,
      });
      await userAddress.save();

      return res.redirect("/userAccount");
    }

    // 7. send mail notify order
    const addressUser = fullAddress + " - " + city + " - " + state;
    mailerOrder.mailerCreate(
      email,
      req.session.cartItemList,
      fullname,
      addressUser,
      "pedding",
      trackingNumber
    );
    req.session.cartItemList = [];

    res.redirect("/");
  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({ error: "An error occurred during checkout." });
  }
});

const generateTrackingNumber = () => {
  // Định dạng: PREFIX + TIMESTAMP + RANDOM NUMBER
  const prefix = "DKD";
  const timestamp = Date.now().toString();
  const randomPart = Math.floor(100000 + Math.random() * 900000).toString();

  return `${prefix}-${timestamp}-${randomPart}`;
};

//delivery
router.get("/delivery", (req, res) => {
  res.render("deliveryFollow");
});

//review
router.post("/review", async (req, res) => {
  const { productId, rating, comment } = req.body;

  const newReview = new Review({
    productId,
    rating,
    comment,
  });

  await newReview.save();

  res.redirect("/product-details/" + productId);
});

//forAddress
router.post("/address", async (req, res) => {
  const { fullAddress, city, state } = req.body;

  try {
    const userId = req.session.userInf._id;
    console.log(userId);

    // Cập nhật tất cả các địa chỉ của userId thành default: false
    await Address.updateMany({ userId }, { default: false });

    // Tạo địa chỉ mới và đặt làm mặc định
    const newAddress = new Address({
      userId,
      fullAddress,
      city,
      state,
      default: true,
    });

    await newAddress.save();

    res.redirect("/userAccount");
  } catch (error) {
    console.error("Error saving address:", error);
    res.status(500).send("Internal Server Error");
  }
});

//forAddress
router.get("/address/del/:id", async (req, res) => {
  const addressId = req.params.id;

  await Address.findByIdAndDelete({ _id: addressId });

  res.redirect("/userAccount");
});

//for view order
router.get("/viewOrder/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    // Lấy các OrderItem có orderId tương ứng và populate productId
    const orderItems = await OrderItem.find({ orderId }).populate("productId"); // Populate productId trong mỗi OrderItem

    console.log(orderItems);

    // Lấy đơn hàng để hiển thị thông tin như orderStatus, totalPrice,...
    const order = await Order.findById(orderId);

    res.render("viewOrder", {
      orderStatus: order.orderStatus,
      orderId: order._id,
      totalPrice: order.totalPrice,
      discount: order.discount,
      createdAt: order.createdAt,
      orderItems: orderItems, // Truyền danh sách OrderItem đã populate productId
    });
  } catch (error) {
    console.error("Error fetching order items:", error);
    res.status(500).send("Internal Server Error");
  }
});

// For updating profile
router.post("/updateProfile/:id", async (req, res) => {
  const { fullname, email, phoneNumber, defaultAddress } = req.body;

  // Xử lý chỉ mục của địa chỉ mặc định
  const indexAddress = parseInt(defaultAddress.split("/")[0].trim());
  try {
    // Cập nhật thông tin người dùng
    await User.findOneAndUpdate(
      { _id: req.session.userInf._id },
      {
        fullname,
        email,
        phoneNumber,
      },
      { new: true } // Trả về tài liệu đã cập nhật
    );

    // Lấy danh sách địa chỉ của người dùng
    const addressLs = await Address.find({ userId: req.session.userInf._id });

    // Duyệt qua danh sách địa chỉ và cập nhật địa chỉ cần thiết
    for (let index = 0; index < addressLs.length; index++) {
      const item = addressLs[index];
      // Đánh dấu địa chỉ mặc định
      if (index === indexAddress) {
        item.default = true;
      } else {
        item.default = false;
      }

      // Lưu lại thông tin đã cập nhật
      await item.save();
    }
    req.session.userInf.fullname = fullname;

    // Điều hướng về trang tài khoản người dùng
    res.redirect("/userAccount");
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).send("An error occurred while updating the profile.");
  }
});

router.get("/admins/dashboard", async function(req, res, next) {
  if (req.session.user && req.session.userInf.role == "admin") {
    try {
      const month = parseInt(req.query.month) || new Date().getMonth() + 1; // Get the selected month from query params, default to current month
      const year = new Date().getFullYear(); // Get the current year

      // Fetch data from the database for the selected month
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const orders = await Order.find({
        createdAt: {
          $gte: startDate,
          $lt: endDate
        }
      });

      // Process data to get daily statistics
      const dailyRevenue = Array(endDate.getDate()).fill(0);
      const dailyOrders = Array(endDate.getDate()).fill(0);

      orders.forEach(order => {
        const day = order.createdAt.getDate() - 1;
        dailyRevenue[day] += order.totalPrice / 1000000; // Convert to millions
        dailyOrders[day] += 1;
      });

      // Fetch total customers excluding "Guess"
      const totalCustomers = await User.countDocuments({ username: { $ne: "Guess" } });

      // Fetch total revenue
      const totalRevenue = await Order.aggregate([
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
      ]);

      // Fetch total orders
      const totalOrders = await Order.countDocuments();

      // Fetch number of visits (total users)
      const numberOfVisits = await User.countDocuments();

      // Fetch top 3 best seller categories
      const topCategories = await Order.aggregate([
        { $unwind: "$items" },
        { $lookup: { from: "products", localField: "items.productId", foreignField: "_id", as: "product" } },
        { $unwind: "$product" },
        { $group: { _id: "$product.categoryId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 3 },
        { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "category" } },
        { $unwind: "$category" },
        { $project: { _id: 0, name: "$category.name", count: 1 } }
      ]);

      res.render('./admins/dashboard', {
        title: 'Dashboard',
        dailyRevenue: dailyRevenue,
        dailyOrders: dailyOrders,
        selectedMonth: month,
        totalCustomers: totalCustomers,
        totalRevenue: totalRevenue[0] ? totalRevenue[0].total / 1000000 : 0, // Convert to millions
        totalOrders: totalOrders,
        numberOfVisits: numberOfVisits,
        topCategories: topCategories
      });
    } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.redirect('/');
  }
});

router.get('/admins/product-list', async function(req, res, next) {
  if (req.session.user && req.session.userInf.role == "admin") {
    try {
      const categoryId = req.query.categoryId || ''; // Get the selected category ID from query params
      const page = parseInt(req.query.page) || 1; // Get the current page number from query params, default to 1
      const limit = 7; // Number of items per page
      const skip = (page - 1) * limit; // Calculate the number of items to skip

      const categories = await Category.find(); // Fetch all categories

      let products;
      let totalProducts;
      if (categoryId) {
        products = await Product.find({ categoryId: categoryId }).skip(skip).limit(limit); // Fetch products by selected category
        totalProducts = await Product.countDocuments({ categoryId: categoryId }); // Get the total number of products in the selected category
      } else {
        products = await Product.find().skip(skip).limit(limit); // Fetch all products
        totalProducts = await Product.countDocuments(); // Get the total number of products
      }

      const totalPages = Math.ceil(totalProducts / limit); // Calculate the total number of pages

      res.render('./admins/product-list', { 
        title: 'Product List', 
        products: products, 
        categories: categories, 
        selectedCategoryId: categoryId,
        currentPage: page,
        totalPages: totalPages
      });
    } catch (err) {
      console.error('Error fetching products or categories:', err);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.redirect('/');
  }
});

router.get("/admins/product_view/:id", async function (req, res, next) {
  if (req.session.user && req.session.userInf.role == "admin") {
    const { id } = req.params;

    // Tìm thông tin sản phẩm theo ID
    const productInf = await Product.findById(id);
    const categoryLs = await Category.find();

    res.render("./admins/product_view", {
      title: "Express",
      productInf,
      categoryLs,
    });
  } else {
    res.redirect("/");
  }
});

//Admin view product
router.post(
  "/admins/product_view/:id",
  upload.single("productImg"),
  async function (req, res, next) {
    if (req.session.user && req.session.userInf.role == "admin") {
      const { id } = req.params;
      const {
        name,
        description,
        categoryId,
        stock,
        colors,
        price,
        productImg,
      } = req.body;

      // Xử lý description và price
      const trimmedDescription = description.trim();
      const formattedPrice = price
        .replace(/\./g, "") // Loại bỏ dấu chấm
        .replace(/[₫]/g, "") // Loại bỏ ký hiệu ₫
        .trim();

      console.log({
        name,
        trimmedDescription,
        categoryId,
        stock,
        colors,
        formattedPrice,
        productImg,
      });

      try {
        // Tìm và cập nhật thông tin sản phẩm
        const productInf = await Product.findByIdAndUpdate(
          id,
          {
            name,
            description: trimmedDescription,
            categoryId,
            stock,
            colors,
            price: Number(formattedPrice),
          },
          { new: true } // Trả về dữ liệu sản phẩm đã được cập nhật
        );

        // Lấy danh sách category nếu cần render lại
        const categoryLs = await Category.find();

        res.redirect("/admins/product_view/" + id);
      } catch (err) {
        console.error("Error updating product:", err);
        res.status(500).send("Internal Server Error");
      }
    } else {
      res.redirect("/");
    }
  }
);

//Admin add product page get
router.get("/admins/product_add", async function (req, res, next) {
  if (req.session.user && req.session.userInf.role == "admin") {
    try {
      const categoryLs = await Category.find(); // Fetch categories from the database
      res.render("./admins/product_add", {
        title: "Express",
        categoryLs: categoryLs,
      });
    } catch (err) {
      console.error("Error fetching categories:", err);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.redirect("/");
  }
});

//Admin add product page post
const uploadImg = require("../middlewares/uploadImg");
router.post(
  "/admins/product_add",
  uploadImg.upload.single("productImg"),
  async function (req, res, next) {
    if (req.session.user && req.session.userInf.role == "admin") {
      // Lấy dữ liệu từ req.body
      const { name, description, categoryId, stock, colors, price } = req.body;

      // Lấy thông tin ảnh từ req.file (sau khi multer xử lý)
      const productImg = req.file ? req.file.filename : null;

      // Xử lý description (cắt khoảng trắng đầu và cuối)
      const trimmedDescription = description.trim();

      console.log({
        name,
        trimmedDescription,
        categoryId,
        stock,
        colors,
        price,
        productImg,
      });

      try {
        // Tạo sản phẩm mới
        const newProduct = new Product({
          name,
          description: trimmedDescription,
          categoryId,
          stock,
          colors,
          price,
          productImg: productImg, // Lưu tên file hình ảnh
        });

        // Lưu sản phẩm vào cơ sở dữ liệu
        await newProduct.save();

        // Chuyển hướng về trang danh sách sản phẩm
        res.redirect("/admins/product-list");
      } catch (err) {
        console.error("Error adding product:", err);
        res.status(500).send("Internal Server Error");
      }
    } else {
      res.redirect("/");
    }
  }
);

//Delete product by id
router.post('/admins/product_delete/:id', async function(req, res, next) {
  if(req.session.user && req.session.userInf.role == "admin"){
    //Code here
    const id = req.params.id;
    await Product.findByIdAndDelete(id);

    res.redirect('/admins/product-list');
  }else{
    res.redirect('/');
  }
});

router.get("/admins/order-list", async function (req, res, next) {
  if (req.session.user && req.session.userInf.role == "admin") {
    try {
      const page = parseInt(req.query.page) || 1; // Get the current page number from query params, default to 1
      const limit = 10; // Number of items per page
      const skip = (page - 1) * limit; // Calculate the number of items to skip

      const totalOrders = await Order.countDocuments(); // Get the total number of orders
      const orders = await Order.find()
        .populate("userId")
        .skip(skip)
        .limit(limit); // Fetch orders for the current page

      const totalPages = Math.ceil(totalOrders / limit); // Calculate the total number of pages

      res.render("./admins/order-list", {
        title: "Express",
        orders: orders,
        currentPage: page,
        totalPages: totalPages,
      });
    } catch (err) {
      next(err); // Pass errors to the error handler
    }
  } else {
    res.redirect("/");
  }
});

router.get("/admins/user-list", async function (req, res, next) {
  if (req.session.user && req.session.userInf.role == "admin") {
    try {
      const page = parseInt(req.query.page) || 1; // Get the current page number from query params, default to 1
      const limit = 10; // Number of items per page
      const skip = (page - 1) * limit; // Calculate the number of items to skip

      const totalUsers = await User.countDocuments({ username: { $nin: ["Guess", "Admin"] }}); // Get the total number of users excluding "Guess" and "Admin"
      const users = await User.find({ username: { $nin: ["Guess", "Admin"] }}).skip(skip).limit(limit); // Fetch users for the current page excluding "Guess"

      const totalPages = Math.ceil(totalUsers / limit); // Calculate the total number of pages

      res.render("./admins/user-list", {
        title: "Express",
        users: users,
        currentPage: page,
        totalPages: totalPages,
      });
    } catch (err) {
      next(err); // Pass errors to the error handler
    }
  } else {
    res.redirect("/");
  }
});

router.post('/admins/user-update/:id', async function(req, res, next) {
  if (req.session.user && req.session.userInf.role == "admin") {
    try {
      const { id } = req.params;
      const { fullname, email, phoneNumber, status } = req.body;

      await User.findByIdAndUpdate(id, {
        fullname: fullname,
        email: email,
        phoneNumber: phoneNumber,
        role: status
      });

      res.redirect('/admins/user-list');
    } catch (err) {
      console.error('Error updating user:', err);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.redirect('/');
  }
});

router.get('/admins/dashboard', async function(req, res, next) {
  if (req.session.user && req.session.userInf.role == "admin") {
    try {
      const currentMonth = req.query.month || moment().format('YYYY-MM'); // Get the selected month or default to current month
      const startDate = moment(currentMonth).startOf('month').toDate();
      const endDate = moment(currentMonth).endOf('month').toDate();

      // Fetch data from the database for the selected month
      const orders = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startDate,
              $lte: endDate
            }
          }
        },
        {
          $group: {
            _id: { $dayOfMonth: "$createdAt" },
            totalRevenue: { $sum: "$totalPrice" },
            totalOrders: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);

      const daysInMonth = moment(currentMonth).daysInMonth();
      const revenueData = Array(daysInMonth).fill(0);
      const ordersData = Array(daysInMonth).fill(0);

      orders.forEach(order => {
        revenueData[order._id - 1] = order.totalRevenue;
        ordersData[order._id - 1] = order.totalOrders;
      });

      res.render('./admins/dashboard', {
        title: 'Dashboard',
        revenueData: revenueData,
        ordersData: ordersData,
        currentMonth: currentMonth
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.redirect('/');
  }
});

router.get('/filter-orders', async (req, res) => {
  const { startDate, endDate } = req.query;
  let filter = {};

  if (startDate && endDate) {
    filter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  try {
    const orders = await Order.find(filter).populate('userId');
    res.render('./admins/order-list', {
      orders,
      currentPage: 1, // Adjust as needed
      totalPages: 1 // Adjust as needed
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get('/order-details/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('userId');
    if (!order) {
      return res.status(404).send('Order not found');
    }

    const orderItems = await OrderItem.find({ orderId: req.params.orderId }).populate('productId');
    res.json({ order, orderItems });
  } catch (err) {
    console.error(`Error fetching order details for ID: ${req.params.orderId}`, err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/update-order-status/:orderId', async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { orderStatus, updatedAt: Date.now() },
      { new: true }
    );
    if (!order) {
      return res.status(404).send('Order not found');
    }
    res.json(order);
  } catch (err) {
    console.error(`Error updating order status for ID: ${req.params.orderId}`, err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;