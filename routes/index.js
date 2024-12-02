var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

const Category = require('../models/CategoryModel');
const Product = require('../models/ProductModel');
const User = require('../models/UserModel');
const Cart = require('../models/CartModel');
const CartItem = require('../models/CartItemModel');

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
    req.session.user = {userId : savedUser.id}
    //Create new cart for new user
    const newCart = new Cart({
      userId : savedUser.id,
    });
    const savedCart = await newCart.save();
    req.session.cart = {cartId : savedCart.id}
  }

  console.log(req.session.user);
  console.log(req.session.cart);
  
  //get cartItem list
  const cartId_find_items = req.session.cart.cartId;
  const cartItems = await CartItem.find({ cartId: cartId_find_items }).populate('productId');  req.session.cartItemList = cartItems;
  const cartItemList = req.session.cartItemList;

  //Ready for view
  const categories = await Category.find();
  const products = await Product.find();

  const webLocationHost = `${req.protocol}://${req.get('host')}`;
  res.render('homePage', { 
    title: 'Home Page', 
    webLocationHost, 
    categories, 
    products,
    cartItemList,
    cartId: req.session.cart.cartId
  });
});

/* GET shop page. */
router.get('/shop', async function(req, res, next) {
  if(!req.session.user){
    res.redirect('/');
  }else{
    const categories = await Category.find();
    const products = await Product.find();

    const cartId = req.session.cart.cartId;
    const webLocationHost = `${req.protocol}://${req.get('host')}`;

    //get cartItem list
    const cartId_find_items = req.session.cart.cartId;
    const cartItems = await CartItem.find({ cartId: cartId_find_items }).populate('productId');  req.session.cartItemList = cartItems;
    req.session.cartItemList = cartItems;
    const cartItemList = req.session.cartItemList;

    res.render('shop', { title: 'Shop', 
      webLocationHost, 
      categories, 
      products, 
      categoryName: '',
      cartId,
      cartItemList
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
    const cartItems = await CartItem.find({ cartId: cartId_find_items }).populate('productId');  req.session.cartItemList = cartItems;
    req.session.cartItemList = cartItems;
    const cartItemList = req.session.cartItemList;

    res.render('shop', { title: 'Shop', 
      webLocationHost, 
      categories, 
      products, 
      categoryName,
      cartId,
      cartItemList
    });
  }
});


//DELETE cart item 
router.post('/cart_item/:id', async function(req, res, next) {
  const deletedCartItem = await CartItem.findByIdAndDelete(req.params.id);
  res.redirect(req.body.windowLocation);
});

/* GET cart page. */
router.get('/cart', async function(req, res, next) {
  const categories = await Category.find();
  const webLocationHost = `${req.protocol}://${req.get('host')}`;
  res.render('cart', { title: 'Cart', webLocationHost, categories});
});

/* GET checkout page. */
router.get('/checkout', async function(req, res, next) {
  const categories = await Category.find();
  const webLocationHost = `${req.protocol}://${req.get('host')}`;
  res.render('checkout', { title: 'Checkout', webLocationHost, categories});
});

/* GET wishlist page. */
router.get('/wishlist', async function(req, res, next) {
  const categories = await Category.find();
  const webLocationHost = `${req.protocol}://${req.get('host')}`;
  res.render('wishlist', { title: 'Wishlist', webLocationHost, categories});
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
    const cartItems = await CartItem.find({ cartId: cartId_find_items }).populate('productId');  req.session.cartItemList = cartItems;
    req.session.cartItemList = cartItems;
    const cartItemList = req.session.cartItemList;

    res.render('about', { title: 'About', 
      webLocationHost, 
      categories, 
      categoryName,
      cartId,
      cartItemList
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
    const cartItems = await CartItem.find({ cartId: cartId_find_items }).populate('productId');  req.session.cartItemList = cartItems;
    req.session.cartItemList = cartItems;
    const cartItemList = req.session.cartItemList;

    res.render('contact', { title: 'Contact', 
      webLocationHost, 
      categories, 
      categoryName,
      cartId,
      cartItemList
    });
  }
});

/* GET login page. */
router.get('/login', async function(req, res, next) {
  const categories = await Category.find();
  const webLocationHost = `${req.protocol}://${req.get('host')}`;
  res.render('login', { title: 'Login', webLocationHost, categories});
});

/* GET user account page. */
router.get('/userAccount', async function(req, res, next) {
  const categories = await Category.find();
  const webLocationHost = `${req.protocol}://${req.get('host')}`;
  res.render('userAccount', { title: 'User Account', webLocationHost, categories});
});

/* GET product detail page. */
router.get('/product-details', function(req, res, next) {
  res.render('product-details', { title: 'Express' });
});

module.exports = router;
