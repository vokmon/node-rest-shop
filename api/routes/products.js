const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Handling GET request to /products'
  });
});

router.post('/', (req, res, next) => {
  const product = {
    name: req.body.name,
    price: req.body.price,
  };
  res.status(201).json({
    message: 'Handling POST request to /products',
    creeatedProduct: product,
  });
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  if (id === 'special') {
    res.status(200).json( {
      message: 'You discoveered the special ID',
      id: id,
    });
  } else {
    res.status(200).json( {
      message: 'You passed an ID',
    });
  }
});

router.patch('/:productId', (req, res, next) => {
  res.status(200).json( {
    message: 'Updated product!',
  });
});

router.delete('/:productId', (req, res, next) => {
  res.status(200).json( {
    message: 'Delete product!',
  });
});

module.exports = router;