const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/', async (req, res, next) => {
  try {
    const docs = await Product.find().select('name price _id');
    const response = {
      count: docs.length,
      products: docs.map(doc=> {
        return {
          id: doc._id,
          name: doc.name,
          price: doc.price,
          request: {
            type: 'GET',
            url: `http://localhost:3000/products/${doc._id}`
          }
        }
      }),
    }
    res.status(200).json(response);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err
    })
  }

});

router.post('/', async (req, res, next) => {
  try {
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
    });
    const result = await product.save();
    res.status(201).json({
      message: 'Created product succssfully',
      creeatedProduct: {
        _id: result._id,
        name: result.name,
        price: result.price,
        request: {
          type: 'GET',
          url: `http://localhost:3000/products/${result._id}`
        }
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: e
    })
  }
});

router.get('/:productId', async (req, res, next) => {
  const id = req.params.productId;
  try {
    const doc = await Product.findById(id).select('name price _id');
    console.log('From database', doc);
    if (doc) {
      res.status(200).json({
        product: doc,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/products'
        }
      });
    } else {
      res.status(404).json({message: 'No valid entry found for provided ID'});
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({error: err});
  }

});

router.patch('/:productId', async (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  try {
    for (const prop in req.body) {
      updateOps[prop] = req.body[prop];
    }
    console.log('Product: props to update', updateOps);
    const result = await Product.updateOne({
      _id: id,
    }, {
      $set: updateOps
    });
    res.status(200).json({
      message: 'Product updated!',
      request: {
        type: 'GET',
        url: `http://localhost:3000/products/${id}`
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err,
    })
  }

});

router.delete('/:productId', async (req, res, next) => {
  const id = req.params.productId;
  try {
    const reult = await Product.deleteOne({
      _id: id,
    });
    res.status(200).json({
      message: 'Product deleted',
      request: {
        type: 'POST',
        url: 'http://localhost:3000/products',
        data: { name: 'String', price: 'Number'}
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err});
  }
});

module.exports = router;