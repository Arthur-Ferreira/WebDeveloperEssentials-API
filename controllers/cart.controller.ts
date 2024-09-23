import { Request, Response, NextFunction } from "express"
import Product from '../models/product.model'
import Cart from "../models/cart.model"

let cart = new Cart();

async function getCart(req: Request, res: Response): Promise<void> {
  res.status(200).json({
    items: cart.items,
    totalQuantity: cart.totalQuantity,
    totalPrice: cart.totalPrice
  })
}

async function addCartItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await Product.findById(req.body.productId)

    if (!product) {
      res.status(404).json({ message: 'Product not found!' })
      return
    }
    // const cart = res.locals.cart

    cart.addItem(product)

    // req.session.cart = cart

    res.status(201).json({
      message: 'Cart updated!',
      cart: {
        items: cart.items,
        totalQuantity: cart.totalQuantity,
        totalPrice: cart.totalPrice
      }
    })
  } catch (error) {
    next(error)
  }
}

function updateCartItem(req: Request, res: Response): void {
  // const cart = res.locals.cart
  const { productId, quantity } = req.body

  const updatedItemData = cart.updateItem(productId, quantity)

  // req.session.cart = cart

  res.status(200).json({
    message: 'Item updated!',
    updatedCartData: {
      items: cart.items,
      totalQuantity: cart.totalQuantity,
      totalPrice: cart.totalPrice,
      updatedItemPrice: updatedItemData?.updatedItemPrice
    }
  })
}

export {
  addCartItem,
  getCart,
  updateCartItem
}
