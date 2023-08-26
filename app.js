const path = require('path');

const express = require('express');

const db = require('./data/databse');
const authRoutes = require('./routes/auth-routes');
const e = require('express');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'))


app.use(authRoutes);

db.connectToDatabase()
  .then(function () {
    app.listen(3000);
  })
  .catch(function (error) {
    console.log('Faild to connect to the database!');
    console.log(error);
  });