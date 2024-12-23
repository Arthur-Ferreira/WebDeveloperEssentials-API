import express from 'express'

import expressSession from 'express-session'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

import createSessionConfig from './src/util/session'
import * as db from './src/data/database'
import checkAuthStatusMiddleware from './src/middlewares/check-auth'
import protectRoutesMiddleware from './src/middlewares/protect-routes'
import notFoundMiddleware from './src/middlewares/not-found'
import errorHandlerMiddleware from './src/middlewares/error-handler'

import authRoutes from './src/routes/auth.routes'
import productsRoutes from './src/routes/products.routes'
import baseRoutes from './src/routes/base.routes'
import adminRoutes from './src/routes/admin.routes'
import cartRoutes from './src/routes/cart.routes'
import ordersRoutes from './src/routes/orders.routes'
import helmet from 'helmet'
import path from 'path'

const corsOptions = {
  origin: '*', // Permitir todas as origens
  // origin: 'http://localhost:5173/', // Permitir apenas esta origem
  methods: ['GET', 'POST'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
};


const app = express()

const port = process.env.PORT

// Log the path being used for static files
const staticPath = path.join(__dirname, 'src/product-data/images');
console.log('Serving static files from:', staticPath);

// Serve static files from the "product-data/images" directory
app.use('/product-data/images', express.static(staticPath));

// app.use('/products/assets', express.static('product-data'))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors(corsOptions))


const sessionConfig = createSessionConfig()

app.use(expressSession(sessionConfig))
app.use(helmet())

// app.use(cartMiddleware)
// app.use(updateCartPricesMiddleware)

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