import path from 'path'

import express from 'express'
import csrf from 'csurf'
import expressSession from 'express-session'
import dotenv from 'dotenv'

dotenv.config()

import createSessionConfig from './src/config/session'
import * as db from './src/data/database'
import addCsrfTokenMiddleware from './src/middlewares/csrf-token'
import errorHandlerMiddleware from './src/middlewares/error-handler'
import checkAuthStatusMiddleware from './src/middlewares/check-auth'
import protectRoutesMiddleware from './src/middlewares/protect-routes'
import cartMiddleware from './src/middlewares/cart'
import updateCartPricesMiddleware from './src/middlewares/update-cart-prices'
import notFoundMiddleware from './src/middlewares/not-found'
import authRoutes from './src/routes/auth.routes'
import productsRoutes from './src/routes/products.routes'
import baseRoutes from './src/routes/base.routes'
import adminRoutes from './src/routes/admin.routes'
import cartRoutes from './src/routes/cart.routes'
import ordersRoutes from './src/routes/orders.routes'

const app = express()

const port = process.env.PORT

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static('public'))
app.use('/products/assets', express.static('product-data'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const sessionConfig = createSessionConfig()

app.use(expressSession(sessionConfig))
app.use(csrf())

app.use(cartMiddleware)
app.use(updateCartPricesMiddleware)

app.use(addCsrfTokenMiddleware)
app.use(checkAuthStatusMiddleware)

app.use(baseRoutes)
app.use(authRoutes)
app.use(productsRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', protectRoutesMiddleware, ordersRoutes)
app.use('/admin', protectRoutesMiddleware, adminRoutes)

app.use(notFoundMiddleware)

app.use(errorHandlerMiddleware)

db.connectToDatabase()
  .then(function () {
    app.listen(port, () => {
      console.log(`App runing at: http://localhost:${port}`)
    })
  })
  .catch(function (error) {
    console.log('Failed to connect to the database!')
    console.log(error)
  })
