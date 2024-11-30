var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var productRouter = require('./routes/ProductRoutes');
var categoryRouter = require('./routes/CategoryRoutes');
var addressRouter = require('./routes/AddressRoutes');
var cartItemRouter  = require('./routes/CartItemRoutes');
var cartRouter  = require('./routes/CartRoutes');
var couponRouter  = require('./routes/CouponRoutes');
var orderItemRouter  = require('./routes/OrderItemRoutes');
var orderRouter  = require('./routes/OrderRoutes');
var reviewRouter  = require('./routes/ReviewRoutes');
var shippingRouter  = require('./routes/ShippingRoutes');
var userRouter  = require('./routes/UserRoutes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Connect database
const database = require('./config/db');
database.connect();

app.use('/', indexRouter);
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/addresses', addressRouter);
app.use('/api/cart_item', cartItemRouter);
app.use('/api/cart', cartRouter);
app.use('/api/coupon', couponRouter);
app.use('/api/order_item', orderItemRouter);
app.use('/api/order', orderRouter);
app.use('/api/review', reviewRouter);
app.use('/api/shipping', shippingRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
