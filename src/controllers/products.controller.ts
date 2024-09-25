import { Request, Response, NextFunction } from "express"

import Product from '../models/product.model'

async function getAllProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const products = await Product.findAll()
    // res.render('customer/products/all-products', { products: products })
    res.json({ products: products })
  } catch (error) {
    next(error)
  }
}

async function getProductDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await Product.findById(req.params.id)
    // res.render('customer/products/product-details', { product: product })
    res.json({ product: product })
  } catch (error) {
    next(error)
  }
}

export {
  getAllProducts,
  getProductDetails
}
