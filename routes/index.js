var express = require('express');
var router = express.Router();

const Category = require('../models/CategoryModel');
const Product = require('../models/ProductModel');


/* GET home page. */
router.get('/', async function(req, res, next) {
  const categories = await Category.find();
  const products = await Product.find();

  const webLocationHost = `${req.protocol}://${req.get('host')}`;
  res.render('homePage', { title: 'Home Page', webLocationHost, categories, products});
});

/* GET shop page. */
router.get('/shop', async function(req, res, next) {
  const categories = await Category.find();
  const products = await Product.find();

  const webLocationHost = `${req.protocol}://${req.get('host')}`;
  res.render('shop', { title: 'Shop', webLocationHost, categories, products, categoryName: ''});
});
/* GET shop page by type category. */
router.get('/shop/:id', async function(req, res, next) {
  const { id } = req.params;

  const categories = await Category.find();
  let categoryName = '';
  categories.forEach((item) => {if(item.id == id){categoryName = item.name}});

  const products = await Product.find({ categoryId: id });

  const webLocationHost = `${req.protocol}://${req.get('host')}`;
  res.render('shop', { title: 'Shop', webLocationHost, categories, products, categoryName});
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
  const categories = await Category.find();
  const webLocationHost = `${req.protocol}://${req.get('host')}`;
  res.render('about', { title: 'About', webLocationHost, categories});
});

/* GET contact page. */
router.get('/contact', async function(req, res, next) {
  const categories = await Category.find();
  const webLocationHost = `${req.protocol}://${req.get('host')}`;
  res.render('contact', { title: 'Contact', webLocationHost, categories});
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
