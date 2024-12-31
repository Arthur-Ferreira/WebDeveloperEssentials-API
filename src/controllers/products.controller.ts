import { Request, Response, NextFunction } from "express"

import Product from '../models/product.model'

async function getAllProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const products = await Product.findAll()
    const productsWithImageUrl = products.map(product => ({
      ...product,
      imagePath: `${req.protocol}://${req.get('host')}/${product.imagePath}`,
      imageUrl: `${req.protocol}://${req.get('host')}${product.imageUrl}`
    }))
    res.json(productsWithImageUrl)
  } catch (error) {
    next(error)
  }
}

async function getProductDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await Product.findById(req.params.id)
    const productsWithImageUrl = {
      ...product,
      imagePath: `${req.protocol}://${req.get('host')}/${product.imagePath}`,
      imageUrl: `${req.protocol}://${req.get('host')}${product.imageUrl}`
    }

    res.json(productsWithImageUrl)
  } catch (error) {
    next(error)
  }
}

export {
  getAllProducts,
  getProductDetails
}
