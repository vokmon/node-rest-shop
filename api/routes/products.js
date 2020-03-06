const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/', async (req, res, next) => {
  try {
    const docs = await Product.find();
    console.log(docs);
    res.status(200).json(docs);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err
    })
  }

});

router.post('/', async (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  try {
    const result = await product.save();
    console.log(result);
    res.status(201).json({
      message: 'Handling POST request to /products',
      creeatedProduct: product,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: err
    })
  }
});

router.get('/:productId', async (req, res, next) => {
  const id = req.params.productId;
  try {
    const doc = await Product.findById(id);
    console.log('From database', doc);
    if (doc) {
      res.status(200).json(doc);
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
    const result = await Product.update({
      _id: id,
    }, {
      $set: updateOps
    });
    console.log(result);
    res.status(200).json(result);
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
    const reult = await Product.remove({
      _id: id,
    });
    res.status(200).json(reult);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err});
  }
});

module.exports = router;