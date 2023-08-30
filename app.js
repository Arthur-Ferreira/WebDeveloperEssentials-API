const path = require('path');

const express = require('express');
const csurf = require('csurf');
const expressSession = require('express-session');

const db = require('./data/database');
const baseRoutes = require('./routes/base-routes');
const authRoutes = require('./routes/auth-routes');
const productsRoutes = require('./routes/products-routes');
const adminRoutes = require('./routes/admin-routes');
const cartRoutes = require('./routes/cart-routes');

const addCsrfTokenMiddleware = require('./middlewares/csrf-token');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
const protectRoutesMiddleware = require('./middlewares/protect-routes');
const cartMiddleware = require('./middlewares/cart');
const createSessionConfig = require('./config/session');

const app = express();

const sessionConfig = createSessionConfig()

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use('/products/assets', express.static('product-data'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(expressSession(sessionConfig));
app.use(csurf());

app.use(cartMiddleware);
app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(productsRoutes);
app.use('/cart', cartRoutes);
app.use(authRoutes);
app.use(protectRoutesMiddleware);
app.use('/admin', adminRoutes);

app.use(errorHandlerMiddleware);

db.connectToDatabase()
  .then(function () {
    app.listen(3000);
  })
  .catch(function (error) {
    console.log('Faild to connect to the database!');
    console.log(error);
  });