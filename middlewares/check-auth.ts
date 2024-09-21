import { Request, Response, NextFunction } from 'express'

function checkAuthStatus(req: Request, res: Response, next: NextFunction): void {
  const uid = req.session.uid

  if (!uid) {
    return next()
  }

  res.locals.uid = uid
  res.locals.isAuth = true
  res.locals.isAdmin = req.session.isAdmin
  next()
}

export default checkAuthStatus
