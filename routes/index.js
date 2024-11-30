var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('homePage', { title: 'Express' });
});

router.get('/cart', function(req, res, next) {
  res.render('cart', { title: 'Express' });
});

router.get('/checkout', function(req, res, next) {
  res.render('checkout', { title: 'Express' });
});

router.get('/shop', function(req, res, next) {
  res.render('shop', { title: 'Express' });
});

router.get('/product-details', function(req, res, next) {
  res.render('product-details', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/my-account', function(req, res, next) {
  res.render('my-account', { title: 'Express' });
});

router.get('/wishlist', function(req, res, next) {
  res.render('wishlist', { title: 'Express' });
});

router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Express' });
});

router.get('/blog', function(req, res, next) {
  res.render('blog', { title: 'Express' });
});

router.get('/blog-details', function(req, res, next) {
  res.render('blog-details', { title: 'Express' });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'Express' });
});

router.get('/faq', function(req, res, next) {
  res.render('faq', { title: 'Express' });
});

module.exports = router;
