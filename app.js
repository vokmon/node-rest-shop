const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');
const checkAuth = require('./api/middleware/check-auth');

mongoose.connect(`mongodb+srv://node-rest-shop:${process.env.MONGO_ATLAS_PWD}@node-rest-shop-wmqrd.mongodb.net/node-rest-shop?retryWrites=true&w=majority`,
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// logger
app.use(morgan('dev'));

// make 'uploads' folder publicly available
// url path 'uploads' to folder uploads
// example http://localhost:3000/uploads/2020-03-08T04_35_15.055Z-kitten-small.png
app.use('/uploads', express.static('uploads'));

// parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// setup cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

// unprotected route
app.use('/users', userRoutes);

// after this line, the routes are protected, it needs to pass authorization header
app.use(checkAuth);
// Routes that handle the server
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);


app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
})
module.exports = app;