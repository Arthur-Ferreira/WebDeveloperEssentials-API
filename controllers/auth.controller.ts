import { Request, Response, NextFunction } from "express"

import User from '../models/user.model'
import authUtil from '../util/authentication'
import validation from '../util/validation'
import sessionFlash from '../util/session-flash'

function getSignup(req: Request, res: Response): void {
  let sessionData = sessionFlash.getSessionData(req)

  if (!sessionData) {
    sessionData = {
      email: '',
      confirmEmail: '',
      password: '',
      fullname: '',
      street: '',
      postal: '',
      city: ''
    }
  }

  res.render('customer/auth/signup', { inputData: sessionData })
}

async function signup(req: Request, res: Response, next: NextFunction): Promise<void> {
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body['confirm-email'],
    password: req.body.password,
    fullname: req.body.fullname,
    address: {
      street: req.body.street,
      postal: req.body.postal,
      city: req.body.city
    }
  }

  if (
    !validation.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.address
    ) ||
    !validation.emailIsConfirmed(req.body.email, req.body['confirm-email'])
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage:
          'Please check your input. Password must be at least 6 character slong, postal code must be 5 characters long.',
        ...enteredData
      },
      function () {
        res.redirect('/signup')
      }
    )
    return
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password,
    fullname: req.body.fullname,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city
  })

  try {
    const existsAlready = await user.existsAlready()

    if (existsAlready) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage: 'User exists already! Try logging in instead!',
          ...enteredData
        },
        function () {
          res.redirect('/signup')
        }
      )
      return
    }

    await user.signup()
  } catch (error) {
    next(error)
    return
  }

  res.redirect('/login')
}

function getLogin(req: Request, res: Response): void {
  let sessionData = sessionFlash.getSessionData(req)

  if (!sessionData) {
    sessionData = {
      email: '',
      password: ''
    }
  }

  res.render('customer/auth/login', { inputData: sessionData })
}

async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  const user = new User({ email: req.body.email, password: req.body.password })
  let existingUser
  try {
    existingUser = await user.getUserWithSameEmail()
  } catch (error) {
    next(error)
    return
  }

  const sessionErrorData = {
    errorMessage:
      'Invalid credentials - please double-check your email and password!',
    email: user.email,
    password: user.password
  }

  if (!existingUser) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect('/login')
    })
    return
  }

  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  )

  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect('/login')
    })
    return
  }

  authUtil.createUserSession(req, existingUser, function () {
    res.redirect('/')
  })
}

function logout(req: Request, res: Response): void {
  authUtil.destroyUserAuthSession(req)
  res.redirect('/login')
}

export {
  getSignup,
  getLogin,
  signup,
  login,
  logout
}
