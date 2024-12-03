var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

const Category = require('../models/CategoryModel');
const Product = require('../models/ProductModel');
const User = require('../models/UserModel');
const Cart = require('../models/CartModel');
const CartItem = require('../models/CartItemModel');
const Wishlist = require('../models/wishListModel');
const WishlistItem = require('../models/wishListItemModel');

/* GET home page. */
router.get('/', async function(req, res, next) {
  if(!req.session.user){
    //Create new account for guess
    const newUser = new User({
      username: 'Guess',
      password : await bcrypt.hash('123456', 10),
      email : 'none@none.com',
      phoneNumber: 'none',
    });
    const savedUser = await newUser.save();
    req.session.user = {userId : savedUser.id};
    req.session.userInf = savedUser;
    
    //Create new cart for new user
    const newCart = new Cart({
      userId : savedUser.id,
    });
    const savedCart = await newCart.save();
    req.session.cart = {cartId : savedCart.id}

    //Create new wishlist for new user
    const newWishlist = new Wishlist({
      userId : savedUser.id,
    })
    const savedWishlist = await newWishlist.save();
    req.session.wishlist = {wishlistId : savedWishlist.id}
  }

  console.log(req.session.userInf.username);
  console.log(req.session.cart);
  
  //get cartItem list
  const cartId_find_items = req.session.cart.cartId;
  const cartItems = await CartItem.find({ cartId: cartId_find_items }).populate('productId'); 
  req.session.cartItemList = cartItems;
  const cartItemList = req.session.cartItemList;

   //get wishlist item list
   const wishlistId_find_items = req.session.wishlist.wishlistId;
   const wishlistItems = await WishlistItem.find({ wishlistId: wishlistId_find_items }).populate('productId'); 
   req.session.wishlistItemList = wishlistItems;
   const wishlistItemList = req.session.wishlistItemList;

  //Ready for view
  const categories = await Category.find();
  const products = await Product.find().populate('categoryId');

  const webLocationHost = `${req.protocol}://${req.get('host')}`;
  res.render('homePage', { 
    title: 'Home Page', 
    webLocationHost, 
    categories, 
    products,
    cartItemList,
    cartId: req.session.cart.cartId,
    wishlistId: req.session.wishlist.wishlistId,
    wishlistItemList,
    userInf : req.session.userInf
  });
});

/* GET shop page. */
router.get('/shop', async function(req, res, next) {
  if(!req.session.user){
    res.redirect('/');
  }else{
    const categories = await Category.find();
    const products = await Product.find().populate('categoryId');

    const cartId = req.session.cart.cartId;
    const webLocationHost = `${req.protocol}://${req.get('host')}`;

    //get cartItem list
    const cartId_find_items = req.session.cart.cartId;
    const cartItems = await CartItem.find({ cartId: cartId_find_items }).populate('productId'); 
    req.session.cartItemList = cartItems;
    const cartItemList = req.session.cartItemList;

    //get wishlist item list
   const wishlistId_find_items = req.session.wishlist.wishlistId;
   const wishlistItems = await WishlistItem.find({ wishlistId: wishlistId_find_items }).populate('productId'); 
   req.session.wishlistItemList = wishlistItems;
   const wishlistItemList = req.session.wishlistItemList;

    res.render('shop', { title: 'Shop', 
      webLocationHost, 
      categories, 
      products, 
      categoryName: '',
      cartId,
      cartItemList,
      wishlistId: req.session.wishlist.wishlistId,
      wishlistItemList: wishlistItemList,
      userInf : req.session.userInf
    });
  }
});   
  
/* GET shop page by type category. */
router.get('/shop/:id', async function(req, res, next) {
  if(!req.session.user){
    res.redirect('/');
  }else{
    const { id } = req.params;

    const categories = await Category.find();
    let categoryName = '';
    categories.forEach((item) => {if(item.id == id){categoryName = item.name}});

    const products = await Product.find({ categoryId: id });

    const webLocationHost = `${req.protocol}://${req.get('host')}`;
    const cartId = req.session.cart.cartId;

    //get cartItem list
    const cartId_find_items = req.session.cart.cartId;
    const cartItems = await CartItem.find({ cartId: cartId_find_items }).populate('productId');  
    req.session.cartItemList = cartItems;
    const cartItemList = req.session.cartItemList;

    //get wishlist item list
   const wishlistId_find_items = req.session.wishlist.wishlistId;
   const wishlistItems = await WishlistItem.find({ wishlistId: wishlistId_find_items }).populate('productId'); 
   req.session.wishlistItemList = wishlistItems;
   const wishlistItemList = req.session.wishlistItemList;

    res.render('shop', { title: 'Shop', 
      webLocationHost, 
      categories, 
      products, 
      categoryName,
      cartId,
      cartItemList,
      wishlistId: req.session.wishlist.wishlistId,
      wishlistItemList: req.session.wishlistItemList,
      userInf : req.session.userInf
    });
  }
});


//DELETE cart item 
router.post('/cart_item/:id', async function(req, res, next) {
  const deletedCartItem = await CartItem.findByIdAndDelete(req.params.id);
  res.redirect(req.body.windowLocation);
});

//DELETE many cart item 
router.post('/cart_item_delmany', async function(req, res, next) {
  console.log(req.body)
  if(req.body.listCartItemID_remove !== ''){
    const listCartItemRemove = req.body.listCartItemID_remove.split(';');
    if(listCartItemRemove.length > 0 && listCartItemRemove){
      listCartItemRemove.forEach( async (item)=>{
        await CartItem.findByIdAndDelete(item);
      })
    }
  }
  if(req.body.listQuantity_change !== ''){
    const listQuantity_change = JSON.parse(req.body.listQuantity_change);
    console.log(listQuantity_change);
    if(listQuantity_change.length > 0){
      listQuantity_change.forEach(async(item) =>{
        const updatedCartItem = await CartItem.findById(item.cartItemID);
        updatedCartItem.quantity = item.quantity;
        await updatedCartItem.save();
      })
    }
  }
  res.redirect(req.body.currentURL);
});

//add cart item 
router.post('/cart_item', async function(req, res, next) {
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
        const existingColors = existingCartItem.color.split(',').map(col => col.trim());
        if (!existingColors.includes(color)) {
          // If the color is not in the list, add the new color (separated by a comma)
          existingCartItem.color = existingCartItem.color + ',' + color;
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
    console.error('Error adding/updating cart item:', error);
    // Return an error response in case of an exception
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* GET cart page. */
router.get('/cart', async function(req, res, next) {
  if(!req.session.user){
    res.redirect('/');
  }else{
    const { id } = req.params;

    const categories = await Category.find();
    let categoryName = '';
    categories.forEach((item) => {if(item.id == id){categoryName = item.name}});

    const webLocationHost = `${req.protocol}://${req.get('host')}`;
    const cartId = req.session.cart.cartId;

    //get cartItem list
    const cartId_find_items = req.session.cart.cartId;
    const cartItems = await CartItem.find({ cartId: cartId_find_items }).populate('productId');  
    req.session.cartItemList = cartItems;
    const cartItemList = req.session.cartItemList;

       //get wishlist item list
   const wishlistId_find_items = req.session.wishlist.wishlistId;
   const wishlistItems = await WishlistItem.find({ wishlistId: wishlistId_find_items }).populate('productId'); 
   req.session.wishlistItemList = wishlistItems;
   const wishlistItemList = req.session.wishlistItemList;

   //products
   const products = await Product.find().populate('categoryId');

    res.render('cart', { title: 'Cart', 
      webLocationHost, 
      categories, 
      categoryName,
      cartId,
      cartItemList,
      wishlistId: req.session.wishlist.wishlistId,
      wishlistItemList: req.session.wishlistItemList,
      products,
      userInf : req.session.userInf
    });
  }
});


/* GET product detail page. */
router.get('/product-details/:id', async function(req, res, next) {
  if(!req.session.user){
    res.redirect('/');
  }else{
    const { id } = req.params;

    const categories = await Category.find();
    let categoryName = '';
    categories.forEach((item) => {if(item.id == id){categoryName = item.name}});

    const webLocationHost = `${req.protocol}://${req.get('host')}`;
    const cartId = req.session.cart.cartId;

    //get cartItem list
    const cartId_find_items = req.session.cart.cartId;
    const cartItems = await CartItem.find({ cartId: cartId_find_items }).populate('productId');  
    req.session.cartItemList = cartItems;
    const cartItemList = req.session.cartItemList;

       //get wishlist item list
   const wishlistId_find_items = req.session.wishlist.wishlistId;
   const wishlistItems = await WishlistItem.find({ wishlistId: wishlistId_find_items }).populate('productId'); 
   req.session.wishlistItemList = wishlistItems;
   const wishlistItemList = req.session.wishlistItemList;

    //For product Detail
    const productDetail = await Product.findById(id).populate('categoryId');
    //product
    const products = await Product.find().populate('categoryId');

    res.render('product-details', { title: 'Product Detail', 
      webLocationHost, 
      categories, 
      categoryName,
      cartId,
      cartItemList,
      productDetail,
      wishlistId: req.session.wishlist.wishlistId,
      wishlistItemList: req.session.wishlistItemList,
      products,
      userInf : req.session.userInf
    });
  }
});

/* GET wishlist page. */
router.get('/wishlist', async function(req, res, next) {
  try {
    if(!req.session.user){
      res.redirect('/');
    }else{
      const { id } = req.params;
  
      const categories = await Category.find();
      let categoryName = '';
      categories.forEach((item) => {if(item.id == id){categoryName = item.name}});
  
      const webLocationHost = `${req.protocol}://${req.get('host')}`;
      const cartId = req.session.cart.cartId;
  
      //get cartItem list
      const cartId_find_items = req.session.cart.cartId;
      const cartItems = await CartItem.find({ cartId: cartId_find_items }).populate('productId');  
      req.session.cartItemList = cartItems;
      const cartItemList = req.session.cartItemList;
  
         //get wishlist item list
     const wishlistId_find_items = req.session.wishlist.wishlistId;
     const wishlistItems = await WishlistItem.find({ wishlistId: wishlistId_find_items }).populate('productId'); 
     req.session.wishlistItemList = wishlistItems;
     const wishlistItemList = req.session.wishlistItemList;
  
      //For product Detail
      const productDetail = await Product.findById(id).populate('categoryId');

      //products
      const products = await Product.find().populate('categoryId');
  
      res.render('wishlist', { title: 'Wishlist', 
        webLocationHost, 
        categories, 
        categoryName,
        cartId,
        cartItemList,
        productDetail,
        wishlistId: req.session.wishlist.wishlistId,
        wishlistItemList: req.session.wishlistItemList,
        products,
        userInf : req.session.userInf
      });
    }
  } catch (e) {
    console.log(e); // Log the error object
  }
});

// Create/Delete itemWishlist
router.post('/wishlist_item', async function(req, res, next) {
  const { wishlistId, productId, currentUrl } = req.body;

  try {
    // Check if the product already exists in the wishlist
    const existingWishlistItem = await WishlistItem.findOne({ wishlistId, productId });

    if (existingWishlistItem) {
      // If the item already exists, delete the item from the wishlist
      await WishlistItem.deleteOne({ _id: existingWishlistItem._id });
      console.log('Wishlist item deleted');
      return res.redirect(currentUrl); // Redirect back after deletion
    }

    // If the item doesn't exist, create a new WishlistItem
    const newWishlistItem = new WishlistItem({
      wishlistId,
      productId
    });
    await newWishlistItem.save();

    // After saving, redirect the user
    res.redirect(currentUrl);
  } catch (error) {
    console.error('Error creating/deleting wishlist item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* GET checkout page. */
router.get('/checkout', async function(req, res, next) {
  const categories = await Category.find();
  const webLocationHost = `${req.protocol}://${req.get('host')}`;
  res.render('checkout', { title: 'Checkout', webLocationHost, categories});
});


/* GET about page. */
router.get('/about', async function(req, res, next) {
  if(!req.session.user){
    res.redirect('/');
  }else{
    const { id } = req.params;

    const categories = await Category.find();
    let categoryName = '';
    categories.forEach((item) => {if(item.id == id){categoryName = item.name}});

    const webLocationHost = `${req.protocol}://${req.get('host')}`;
    const cartId = req.session.cart.cartId;

    //get cartItem list
    const cartId_find_items = req.session.cart.cartId;
    const cartItems = await CartItem.find({ cartId: cartId_find_items }).populate('productId');  
    req.session.cartItemList = cartItems;
    const cartItemList = req.session.cartItemList;

       //get wishlist item list
   const wishlistId_find_items = req.session.wishlist.wishlistId;
   const wishlistItems = await WishlistItem.find({ wishlistId: wishlistId_find_items }).populate('productId'); 
   req.session.wishlistItemList = wishlistItems;
   const wishlistItemList = req.session.wishlistItemList;

   //products
   const products = await Product.find().populate('categoryId');

    res.render('about', { title: 'About', 
      webLocationHost, 
      categories, 
      categoryName,
      cartId,
      cartItemList,
      wishlistId: req.session.wishlist.wishlistId,
      wishlistItemList: req.session.wishlistItemList,
      products,
      userInf : req.session.userInf
    });
  }
});

/* GET contact page. */
router.get('/contact', async function(req, res, next) {
  if(!req.session.user){
    res.redirect('/');
  }else{
    const { id } = req.params;

    const categories = await Category.find();
    let categoryName = '';
    categories.forEach((item) => {if(item.id == id){categoryName = item.name}});

    const webLocationHost = `${req.protocol}://${req.get('host')}`;
    const cartId = req.session.cart.cartId;

    //get cartItem list
    const cartId_find_items = req.session.cart.cartId;
    const cartItems = await CartItem.find({ cartId: cartId_find_items }).populate('productId');
    req.session.cartItemList = cartItems;
    const cartItemList = req.session.cartItemList;

       //get wishlist item list
   const wishlistId_find_items = req.session.wishlist.wishlistId;
   const wishlistItems = await WishlistItem.find({ wishlistId: wishlistId_find_items }).populate('productId'); 
   req.session.wishlistItemList = wishlistItems;
   const wishlistItemList = req.session.wishlistItemList;

   //products
   const products = await Product.find().populate('categoryId');

    res.render('contact', { title: 'Contact', 
      webLocationHost, 
      categories, 
      categoryName,
      cartId,
      cartItemList,
      wishlistId: req.session.wishlist.wishlistId,
      wishlistItemList: req.session.wishlistItemList,
      products ,
      userInf : req.session.userInf
    });
  }
});

/* GET login page. */
router.get('/login', async function(req, res, next) {
  if(!req.session.user){
    res.redirect('/');
  }else{
    const { id } = req.params;

    const categories = await Category.find();
    let categoryName = '';
    categories.forEach((item) => {if(item.id == id){categoryName = item.name}});

    const webLocationHost = `${req.protocol}://${req.get('host')}`;
    const cartId = req.session.cart.cartId;

    //get cartItem list
    const cartId_find_items = req.session.cart.cartId;
    const cartItems = await CartItem.find({ cartId: cartId_find_items }).populate('productId');
    req.session.cartItemList = cartItems;
    const cartItemList = req.session.cartItemList;

       //get wishlist item list
   const wishlistId_find_items = req.session.wishlist.wishlistId;
   const wishlistItems = await WishlistItem.find({ wishlistId: wishlistId_find_items }).populate('productId'); 
   req.session.wishlistItemList = wishlistItems;
   const wishlistItemList = req.session.wishlistItemList;

   //products
   const products = await Product.find().populate('categoryId');

   const userInf = req.session.userInf;


    res.render('login', { title: 'Login', 
      webLocationHost, 
      categories, 
      categoryName,
      cartId,
      cartItemList,
      wishlistId: req.session.wishlist.wishlistId,
      wishlistItemList: req.session.wishlistItemList,
      products,
      userInf,
      errorRegister : req.session.registerErr,
      oldDataFormRegister: req.session.oldDataFormRegister,
      errorSign: req.session.signInErr,
      oldDataFormSignIn: req.session.oldDataFormSignIn
    });
  }
})

//Register
const { validateRegistration } = require('../middlewares/validate');
router.post('/login/register',validateRegistration,async (req,res)=>{
  req.session.oldDataFormRegister = null;
  req.session.registerErr = {code: '0',msg: 'Success to create account.'};

  const { username, email, phoneNumber, password } = req.body;

  let updatedData = { username, email, phoneNumber, password };
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updatedData.password = hashedPassword;
  }

  const updatedUser = await User.findByIdAndUpdate(req.session.user.userId, updatedData, { new: true, runValidators: true });
  req.session.userInf = updatedUser;

  res.redirect('/userAccount');
})

//signIn
const { validateSignIn } = require('../middlewares/validateSignIn');
router.post('/login/signIn', validateSignIn, async (req, res) => {
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
      req.session.signInErr = { code: '1', msg: 'Invalid username or email.' };
      req.session.oldDataFormSignIn = req.body;
      return res.redirect('/login'); // Quay lại trang login với thông báo lỗi
  }

  // Kiểm tra mật khẩu
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
      // Nếu mật khẩu không đúng
      req.session.signInErr = { code: '2', msg: 'Incorrect password.' };
      req.session.oldDataFormSignIn = req.body;
      return res.redirect('/login'); // Quay lại trang login với thông báo lỗi
  }

  // Đăng nhập thành công, lưu thông tin người dùng vào session
  req.session.userInf = user;
  req.session.user = {userId : user.id};

  const cart = await Cart.findOne({ userId: user._id });
  req.session.cart = {cartId : cart._id }

  const wishlist = await Wishlist.findOne({ userId: user._id });
  req.session.wishlist = {wishlistId : wishlist._id}

  res.redirect('/userAccount'); // Redirect đến trang tài khoản người dùng
});

/* GET user account page. */
router.get('/userAccount', async function(req, res, next) {
  if(!req.session.user || (req.session.userInf && req.session.userInf.username === "Guess")){
    res.redirect('/');
  }else{
    const { id } = req.params;

    const categories = await Category.find();
    let categoryName = '';
    categories.forEach((item) => {if(item.id == id){categoryName = item.name}});

    const webLocationHost = `${req.protocol}://${req.get('host')}`;
    const cartId = req.session.cart.cartId;

    //get cartItem list
    const cartId_find_items = req.session.cart.cartId;
    const cartItems = await CartItem.find({ cartId: cartId_find_items }).populate('productId');
    req.session.cartItemList = cartItems;
    const cartItemList = req.session.cartItemList;

       //get wishlist item list
   const wishlistId_find_items = req.session.wishlist.wishlistId;
   const wishlistItems = await WishlistItem.find({ wishlistId: wishlistId_find_items }).populate('productId'); 
   req.session.wishlistItemList = wishlistItems;
   const wishlistItemList = req.session.wishlistItemList;

   //products
   const products = await Product.find().populate('categoryId');

   const userInf = req.session.userInf;


    res.render('userAccount', { title: 'User Account', 
      webLocationHost, 
      categories, 
      categoryName,
      cartId,
      cartItemList,
      wishlistId: req.session.wishlist.wishlistId,
      wishlistItemList: req.session.wishlistItemList,
      products,
      userInf,
      errorRegister : req.session.registerErr,
      oldDataFormRegister: req.session.oldDataFormRegister
    });
  }
});

//Logout
router.get('/logout',async (req,res)=>{
  req.session.oldDataFormRegister = null;
  req.session.registerErr = {};

  req.session.userInf = null;
  req.session.user = null;

  res.redirect('/');
})

//For forgot pass
router.get('/forgortpassword',async (req,res)=>{
  res.render('forgotPass',{result : {}});
})

const mailer = require('../helper/mailer');
router.post('/forgortpassword',async (req,res)=>{
  const { email } = req.body;

  const user = await User.findOne({ email });

  let result = { 
    code: 1,
    message: "User not found with the provided email address."
  };
  if (user) {
    const newPassword = user.username + '@@1';

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    mailer.mailerCreate(email, newPassword , user.username);

    result = { 
      code: 0,
      message: "Password reset successfully. Check your email for the new password."
    }
  } 

  res.render('forgotPass', {result});
})


module.exports = router;
