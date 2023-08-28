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

async function getUpdateProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    res.render('admin/products/update-product', { product: product });
  } catch (error) {
    next(error);
  }

}

async function updateProduct(req, res, next) {
  const product = new Product({
    ...req.body,
    _id: req.params.id
  })

  if (req.file) {
    product.replaceImage(req.file.filename);
  }

  try {
    await product.save();
  } catch (error) {
    next(error)
    return;
  }

  res.redirect('/admin/products');
}

module.exports = {
  getProducts: getProducts,
  getNewProducts: getNewProducts,
  createNewProducts: createNewProducts,
  getUpdateProduct: getUpdateProduct,
  updateProduct: updateProduct
}

