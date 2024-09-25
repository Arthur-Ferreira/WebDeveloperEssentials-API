import { Request, Response, NextFunction } from "express"

import User from '../models/user.model'
import authUtil from '../util/authentication'
import validation from '../util/validation'
import sessionFlash from '../util/session-flash'

interface SessionData {
  email: string,
  confirmEmail: string,
  password: string,
  fullname: string,
  street: string,
  postal: string,
  city: string
}

function getSignup(req: Request, res: Response) {
  let sessionData: SessionData = sessionFlash.getSessionData(req)

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

  // res.render('customer/auth/signup', { inputData: sessionData })
  res.status(200).json({ inputData: sessionData })
}

async function signup(req: Request, res: Response, next: NextFunction): Promise<void> {
  const enteredData: SessionData = {
    email: req.body.email,
    confirmEmail: req.body['confirm-email'],
    password: req.body.password,
    fullname: req.body.fullname,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city
  }


  if (
    !validation.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.address,
    ) ||
    !validation.emailIsConfirmed(req.body.email, req.body['confirm-email'])
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage:
          'Please check your input. Password must be at least 6 character slong, postal code must be 5 characters long.',
        ...enteredData
      })

    res.status(400).json({
      message: 'Invalid input.',
      inputData: enteredData,
    });
    return
  }

  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city
  )

  try {
    const existsAlready = await user.existsAlready()

    if (existsAlready) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage: 'User exists already! Try logging in instead!',
          ...enteredData
        })

      res.status(400).json({
        message: 'Invalid input.',
        inputData: enteredData,
      });
      return
    }

    await user.signup()
    res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    next(error)
    return
  }
}

function getLogin(req: Request, res: Response): void {
  let sessionData = sessionFlash.getSessionData(req)

  if (!sessionData) {
    sessionData = {
      email: '',
      password: ''
    }
  }

  // res.render('customer/auth/login', { inputData: sessionData })
  res.status(200).json({ inputData: sessionData });
}

async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  const user = new User(req.body.email, req.body.password);

  try {
    const existingUser = await user.getUserWithSameEmail();

    if (!existingUser) {
      sessionFlash.flashDataToSession(req, {
        errorMessage: 'Invalid credentials - please double-check your email and password!',
        email: user.email,
        password: user.password,
      });

      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const passwordIsCorrect = await user.hasMatchingPassword(existingUser.password);

    if (!passwordIsCorrect) {
      sessionFlash.flashDataToSession(req, {
        errorMessage: 'Invalid credentials - please double-check your email and password!',
        email: user.email,
        password: user.password,
      });

      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    authUtil.createUserSession(req, existingUser, () => {
      res.status(200).json({ message: 'Logged in successfully!' });
    });
  } catch (error) {
    next(error);
  }
}

function logout(req: Request, res: Response): void {
  authUtil.destroyUserAuthSession(req)
  // res.redirect('/login')
  res.status(200).json({ message: 'Logged out successfully' });
}

export {
  getSignup,
  getLogin,
  signup,
  login,
  logout
}
