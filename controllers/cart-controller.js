const Product = require('../models/product-models');

async function addCartItem(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.body.productId)
  } catch(error) {
    return next(error);
  }
  const cart = req.session.cart;
  cart.addItem(product);
  req.session.cart = cart;

  res.status(201).json({
    message: 'Cart updated!',
    newTotalItems: cart.totalQuantity
  }  );
}

module.exports = {
  addCartItem: addCartItem,

}