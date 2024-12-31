import { Request, Response, NextFunction } from "express"

import Product from '../models/product.model'
import Order from '../models/order.model'

/**
 * Retrieves all products from the database and sends them as a JSON response.
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function in the stack.
 * @returns A promise that resolves to void.
 * @throws Will call the next middleware with an error if the database query fails.
 */
async function getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const products = await Product.findAll()
    res.status(200).json({ products: products })
  } catch (error) {
    next(error)
    return
  }
}

/**
 * Handles the creation of a new product by initializing a product object 
 * with default values and returning it as a JSON response.
 * 
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @returns A JSON response containing the initialized product object.
 * @throws No exceptions are thrown.
 */
function getNewProduct(req: Request, res: Response) {
  let newProduct: IProduct = {
    title: "",
    summary: "",
    price: 0,
    description: "",
    image: "",
  }
  res.status(200).json({ inputData: newProduct })
}

async function createNewProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  const product = new Product({
    ...req.body,
    image: req.file?.filename
  })

  try {
    await product.save()
    res.status(201).json({ message: "Product successfuly created" })
  } catch (error) {
    next(error)
  }
}

async function getUpdateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await Product.findById(req.params.id)
    res.status(200).json({ product: product })
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
    res.status(201).json({ message: "Product successfuly updated" })
  } catch (error) {
    next(error)
  }
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
    res.json({
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

    if (order) {

      order.status = newStatus
      await order.save()
      res.json({ message: 'Order updated', newStatus: newStatus })
    } else {
      res.status(404).json({ message: 'Order not found!' });
    }

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
