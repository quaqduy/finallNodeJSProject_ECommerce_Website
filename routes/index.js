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
  const cartItems = await CartItem.find({ cartId: cartId_find_items }).populate('productId'); 
  req.session.cartItemList = cartItems;
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
    const cartItems = await CartItem.find({ cartId: cartId_find_items }).populate('productId'); 
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
    const cartItems = await CartItem.find({ cartId: cartId_find_items }).populate('productId');  
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

    res.render('cart', { title: 'Cart', 
      webLocationHost, 
      categories, 
      categoryName,
      cartId,
      cartItemList
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

    //For product Detail
    const productDetail = await Product.findById(id).populate('categoryId');

    res.render('product-details', { title: 'Product Detail', 
      webLocationHost, 
      categories, 
      categoryName,
      cartId,
      cartItemList,
      productDetail
    });
  }
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
    const cartItems = await CartItem.find({ cartId: cartId_find_items }).populate('productId');  
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
    const cartItems = await CartItem.find({ cartId: cartId_find_items }).populate('productId');
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

module.exports = router;
