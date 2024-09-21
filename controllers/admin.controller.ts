import { Request, Response, NextFunction } from "express"

import Product from '../models/product.model'
import Order from '../models/order.model'

async function getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const products = await Product.findAll()
    res.render('admin/products/all-products', { products: products })
  } catch (error) {
    next(error)
    return
  }
}

function getNewProduct(req: Request, res: Response): void {
  res.render('admin/products/new-product')
}

async function createNewProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  const product = new Product({
    ...req.body,
    image: req.file.filename
  })

  try {
    await product.save()
  } catch (error) {
    next(error)
    return
  }

  res.redirect('/admin/products')
}

async function getUpdateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await Product.findById(req.params.id)
    res.render('admin/products/update-product', { product: product })
  } catch (error) {
    next(error)
  }
}

async function updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  const product = new Product({
    ...req.body,
    _id: req.params.id
  })

  if (req.file) {
    product.replaceImage(req.file.filename)
  }

  try {
    await product.save()
  } catch (error) {
    next(error)
    return
  }

  res.redirect('/admin/products')
}

async function deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  let product
  try {
    product = await Product.findById(req.params.id)
    await product.remove()
  } catch (error) {
    return next(error)
  }

  res.json({ message: 'Deleted product!' })
}

async function getOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const orders = await Order.findAll()
    res.render('admin/orders/admin-orders', {
      orders: orders
    })
  } catch (error) {
    next(error)
  }
}

async function updateOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  const orderId = req.params.id
  const newStatus = req.body.newStatus

  try {
    const order = await Order.findById(orderId)

    order.status = newStatus

    await order.save()

    res.json({ message: 'Order updated', newStatus: newStatus })
  } catch (error) {
    next(error)
  }
}

export {
  getProducts,
  getNewProduct,
  createNewProduct,
  getUpdateProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  updateOrder
}
