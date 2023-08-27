const path = require('path');

const express = require('express');
const csurf = require('csurf');
const expressSession = require('express-session');

const db = require('./data/databse');
const baseRoutes = require('./routes/base-routes');
const authRoutes = require('./routes/auth-routes');
const productsRoutes = require('./routes/products-routes');

const addCsrfTokenMiddleware = require('./middlewares/csrf-token');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
const createSessionConfig = require('./config/session');

const app = express();

const sessionConfig = createSessionConfig()

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.use(expressSession(sessionConfig));
app.use(csurf());

app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);

app.use(errorHandlerMiddleware);

db.connectToDatabase()
  .then(function () {
    app.listen(3000);
  })
  .catch(function (error) {
    console.log('Faild to connect to the database!');
    console.log(error);
  });