import { Request, Response, NextFunction } from "express"

import Product from '../models/product.model'

async function getCart(req: Request, res: Response): Promise<void> {
  res.render('customer/cart/cart')
}

async function addCartItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  let product
  try {
    product = await Product.findById(req.body.productId)
  } catch (error) {
    next(error)
    return
  }

  const cart = res.locals.cart

  cart.addItem(product)
  req.session.cart = cart

  res.status(201).json({
    message: 'Cart updated!',
    newTotalItems: cart.totalQuantity
  })
}

function updateCartItem(req: Request, res: Response): void {
  const cart = res.locals.cart

  const updatedItemData = cart.updateItem(
    req.body.productId,
    +req.body.quantity
  )

  req.session.cart = cart

  res.json({
    message: 'Item updated!',
    updatedCartData: {
      newTotalQuantity: cart.totalQuantity,
      newTotalPrice: cart.totalPrice,
      updatedItemPrice: updatedItemData.updatedItemPrice
    }
  })
}

export {
  addCartItem,
  getCart,
  updateCartItem
}
