const Product = require('../models/product-models');

async function getProducts(req, res, next) {
  try {
    const products = await Product.findAll();
    res.render('admin/products/all-products', { products: products });
  } catch (error) {
    next(error);
    return;
  }
}

function getNewProducts(req, res) {
  res.render('admin/products/new-product');
}

async function createNewProducts(req, res, next) {
  const product = new Product({
    ...req.body,
    iamge: req.file.filename
  });

  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect('/admin/products');
}

module.exports = {
  getProducts: getProducts,
  getNewProducts: getNewProducts,
  createNewProducts: createNewProducts
}
