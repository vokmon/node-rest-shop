const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', async (req, res, next) => {
  try {
    const docs = await Order
    .find()
    .select('product quantity _id')
    .populate('product', '_id, name');
    // .populate('product');
    res.status(200).json({
      count: docs.length,
      orders: docs.map(doc =>{
        return {
          _id: doc._id,
          product: doc.product,
          quantity: doc.quantity,
          request: {
            type: 'GET',
            url: `http://localhost:3000/orders/${doc._id}`
          }
        }
      })
    });
  } catch(err) {
    res.status(200).json({
      error: err,
    });
  }  
});

router.post('/', async (req, res, next) => {
  try {
    // cannot create an order with a non-existing product
    const p = await Product.findById(req.body.productId);
    if (!p) {
      res.status(404).json({
        message: 'Product not found! Please input a correct product id.'
      });
    }
  } catch (e) {
    res.status(500).json({
      message: 'Product not found',
      error: e
    });
    return;
  }

  const order = new Order({
    _id: mongoose.Types.ObjectId(),
    quantity: req.body.quantity,
    product: req.body.productId,
  });

  try {
    const result = await order.save();
    res.status(201).json({
      message: 'Order stored',
      createdOrder: {
        _id: result._id,
        product: result.product,
        quantity: result.quantity,
      },
      request: {
        type: 'GET',
        url: `http://localhost:3000/orders/${result._id}`
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    })
  }

});

router.get('/:orderId', async (req, res, next) => {
  try {
    const order = await Order
    .findById(req.params.orderId)
    .populate('product');
    ;
    if (order) {
      res.status(200).json({
        order: order,
        request: {
          type: 'GET',
          url: `http://localhost:3000/orders`
        }
      });
    } else {
      res.status(404).json({message: 'No valid entry found for provided ID'});
    }

  } catch (err) {
    res.status(500).json({
      error: err,
    })
  }
});

router.delete('/:orderId', async (req, res, next) => {
  const id = req.params.orderId;
  try {
    const reult = await Order.deleteOne({
      _id: id,
    });
    res.status(200).json({
      message: 'Order deleted',
      request: {
        type: 'POST',
        url: 'http://localhost:3000/orders',
        product: { productId: 'String', quantity: 'Number'}
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err});
  }
});

module.exports = router;