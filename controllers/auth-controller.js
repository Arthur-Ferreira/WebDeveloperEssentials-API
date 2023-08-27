const User = require('../models/user-models');

const authUtils = require('../utils/authentication');

function getSignup(req, res) {
  res.render('customer/auth/signup');
}

async function signup(req, res) {
  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city
  );

  await user.signup();

  res.redirect('/login');
}


function getLogin(req, res) {

  res.render('customer/auth/login');
}

async function login(req, res) {
  const user = new User(req.body. email, req.body.password);
  const existingUser = await user.getUserWitSameEmail();

  if(!existingUser) {
    res.redirect('/login')
    return;
  }
  
  const passwordIsCorrect = await user.hasMatchingPassword(existingUser.password);
  
  if(!passwordIsCorrect) {
    res.redirect('/login')
    return;
  }
  
  authUtils.createUserSession(req, existingUser, function() {
    res.redirect('/')
  })
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
}