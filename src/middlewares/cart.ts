import { Request, Response, NextFunction } from 'express'
import Cart from '../models/cart.model'

// Extend the Express session type to include the 'Cart' property

declare module 'express-session' {
  interface Session {
    cart? : Cart
  }
}

function initializeCart(req: Request, res: Response, next: NextFunction): void {
  let cart: Cart

  if (!req.session.cart) {
    cart = new Cart()
  } else {
    const sessionCart = req.session.cart
    cart = new Cart(
      sessionCart.items,
      sessionCart.totalQuantity,
      sessionCart.totalPrice
    )
  }

  res.locals.cart = cart

  next()
}

export default initializeCart
