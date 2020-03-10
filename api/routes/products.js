const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductController = require('../controllers/products');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads')
  },
  filename: (req, file, cb) => {
    // fix for window that cannot have ':' in the file path
    const name = `${new Date().toISOString()}-${file.originalname}`;
    cb(null, name.replace(/:/g, '_'));
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    // reject a file
    // Note: the file is not saved to the disk but it will not throw an error
    // If we want to throw an error we need to specify it in the callback
    // cb(new Error('Unsupported file type'), false);

    cb(null, false);
  }
}
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 8},
  fileFilter: fileFilter,
});


router.get('/', ProductController.products_get_all);

// make post a protected route
router.post('/', checkAuth, upload.single('productImage'), ProductController.products_create_product);

router.get('/:productId', ProductController.products_get_by_id);

router.patch('/:productId', ProductController.products_update_product);

router.delete('/:productId', ProductController.products_delete);

module.exports = router;