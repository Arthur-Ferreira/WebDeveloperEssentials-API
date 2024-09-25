import { Request, Response, NextFunction } from 'express'

function protectRoutes(req: Request, res: Response, next: NextFunction): void {
  if (!res.locals.isAuth) {
    return res.redirect('/401')
  }

  if (req.path.startsWith('/admin') && !res.locals.isAdmin) {
    return res.redirect('/403')
  }

  next()
}

export default protectRoutes
