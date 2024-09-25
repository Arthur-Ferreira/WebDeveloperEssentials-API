import express from 'express'

import * as cartController from '../controllers/cart.controller'

const router = express.Router()

router.get('/', cartController.getCart) // /cart/

router.post('/items', cartController.addCartItem) // /cart/items

router.patch('/items', cartController.updateCartItem)

export default router
