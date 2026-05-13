const express = require('express');
const catalogController = require('../controllers/catalogController');

const router = express.Router();

router.get('/categories', catalogController.getCategories);
router.get('/products', catalogController.getProducts);
router.get('/products/latest', catalogController.getLatestProducts);
router.get('/products/best-sellers', catalogController.getBestSellingProducts);
router.get('/products/promotions', catalogController.getPromotionProducts);
router.get('/products/:id', catalogController.getProductDetail);

module.exports = router;
