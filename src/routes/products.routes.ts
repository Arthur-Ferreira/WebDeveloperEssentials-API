import express from 'express'
import * as productsController from '../controllers/products.controller'

const router = express.Router()

router.get('/products', productsController.getAllProducts)

router.get('/products/:id', productsController.getProductDetails)

export default router
