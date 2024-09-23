import { Request, Response, NextFunction } from "express"

import stripe from 'stripe'

import Order from '../models/order.model'
import User from '../models/user.model'

const stripeKey = process.env.STRIPE_KEY;
if (!stripeKey) {
  throw new Error('STRIPE_KEY is missing');
}
const stripeInstance = new stripe(stripeKey);

async function getOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const orders = await Order.findAllForUser(res.locals.uid)
    res.render('customer/orders/all-orders', {
      orders: orders
    })
  } catch (error) {
    next(error)
  }
}

async function addOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  const cart = res.locals.cart

  let userDocument
  try {
    userDocument = await User.findById(res.locals.uid)
  } catch (error) {
    return next(error)
  }

  const order = new Order(cart, userDocument)

  try {
    await order.save()
  } catch (error) {
    next(error)
    return
  }

  req.session.cart = undefined

  const session = await stripeInstance.checkout.sessions.create({
    line_items: cart.items.map((item: ICart) => {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.title
          },
          unit_amount: +item.product.price.toFixed(2) * 100
        },
        quantity: item.quantity
      }
    }),
    mode: 'payment',
    success_url: 'http://localhost:3000/orders/success',
    cancel_url: 'http://localhost:3000/orders/cancel'
  })

  // res.redirect(303, session.url)
}

function getSuccess(req: Request, res: Response): void {
  res.render('customer/orders/success')
}

function getFailure(req: Request, res: Response): void {
  res.render('customer/orders/failure')
}

export {
  addOrder,
  getOrders,
  getSuccess,
  getFailure
}
