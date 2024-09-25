import { Request, Response, NextFunction } from 'express'

async function updateCartPrices(req: Request, res: Response, next: NextFunction) {
  const cart = res.locals.cart

  await cart.updatePrices()

  req.session.cart = cart;

  next()
}

export default updateCartPrices
