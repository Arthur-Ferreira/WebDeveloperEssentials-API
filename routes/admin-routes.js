const express = require('express');

const adminController = require('../controllers/admin-controller');

const router = express.Router();

router.get('/products', adminController.getProducts);

router.get('/products/new', adminController.getNewProducts);

module.exports = router;