import express from 'express'

import * as adminController from '../controllers/admin.controller'
import imageUploadMiddleware from '../middlewares/image-upload'

const router = express.Router()

router.get('/products', adminController.getProducts) // /admin/products

router.get('/products/new', adminController.getNewProduct)

router.post('/products/new', imageUploadMiddleware, adminController.createNewProduct)

router.get('/products/:id', adminController.getUpdateProduct)

router.post('/products/:id/edit', imageUploadMiddleware, adminController.updateProduct)

router.delete('/products/:id', adminController.deleteProduct)

router.get('/orders', adminController.getOrders)

router.patch('/orders/:id', adminController.updateOrder)

export default router
