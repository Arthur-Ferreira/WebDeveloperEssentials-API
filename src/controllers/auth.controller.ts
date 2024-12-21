import { Request, Response, NextFunction } from "express"
import User from '../models/user.model'
import authUtil from '../util/authentication'
import validation from '../util/validation'
import sessionFlash from '../util/session-flash'
import IUser from '../types'
import IAddress from '../types'

interface ISessionData extends IUser { }

// GET SIGNUP
function getSignup(req: Request, res: Response) {
  let sessionData: ISessionData = sessionFlash.getSessionData(req) || {
    email: '',
    confirmEmail: '',
    password: '',
    fullname: '',
    address: {
      street: '',
      postalCode: '',
      city: ''
    }
  }

  res.status(200).json({ inputData: sessionData })
}

// POST SIGNUP
async function signup(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Validate required fields
    if (!req.body.email || !req.body.password || !req.body.fullname || !req.body['confirm-email']) {
      res.status(400).json({ message: 'Missing required fields.' });
      return;
    }

    // Create address object only if required fields exist
    const address: IAddress = {
      street: req.body.street,
      postalCode: req.body.postalCode,
      city: req.body.city,
    };

    const enteredData: ISessionData = {
      email: req.body.email,
      confirmEmail: req.body['confirm-email'],
      password: req.body.password,
      fullname: req.body.fullname,
      address,
    };

    // Validate user details
    const isValidUserDetails = validation.userDetailsAreValid(
      enteredData.email,
      enteredData.password,
      enteredData.fullname!,
      enteredData.address!
    );

    const isEmailConfirmed = validation.emailIsConfirmed(
      enteredData.email,
      enteredData.confirmEmail!
    );

    if (!isValidUserDetails || !isEmailConfirmed) {
      sessionFlash.flashDataToSession(req, {
        errorMessage:
          'Invalid input. Password must be at least 6 characters long, and postal code must be 5 characters long.',
        ...enteredData,
      });

      res.status(400).json({ message: 'Invalid input.', inputData: enteredData });
      return;
    }

    // Create user instance
    const user = new User(
      enteredData.email,
      enteredData.password,
      enteredData.fullname,
      enteredData.address
    );

    // Check if user already exists
    if (await user.existsAlready()) {
      sessionFlash.flashDataToSession(req, {
        errorMessage: 'User exists already! Try logging in instead!',
        ...enteredData,
      });

      res.status(400).json({ message: 'User exists already.', inputData: enteredData });
      return;
    }

    // Create the new user
    await user.signup();
    res.status(201).json({ message: 'User created successfully!' });

  } catch (error) {
    console.error('Error during signup:', error);
    next(error); // Pass the error to the global error handler
  }
}

interface ISessionData extends IUser {
  email: string;
  password: string;
}


// GET LOGIN
function getLogin(req: Request, res: Response): void {
  let sessionData: ISessionData = sessionFlash.getSessionData(req)

  if (!sessionData) {
    sessionData = {
      email: '',
      password: ''
    }
  }

  // res.render('customer/auth/login', { inputData: sessionData })
  res.status(200).json({ inputData: sessionData });
}

// POST LOGIN
async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {

    const user = new User(req.body.email, req.body.password);
    const existingUser = await user.getUserWithSameEmail();

    console.log(existingUser)

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
        errorMessage: 'Invalid credentials - please double-check your password!',
        email: user.email,
        password: user.password,
      });

      res.status(401).json({ message: 'Password Incorrect - please double-check your password!' });
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

  req.session.destroy((err) => {
    if (err) {
      console.error('Failed to destroy session:', err);
      res.status(500).json({ message: 'Failed to log out' });
      return;
    }
    res.status(200).json({ message: 'Logged out successfully' });
  })
}

export {
  getSignup,
  getLogin,
  signup,
  login,
  logout
}
