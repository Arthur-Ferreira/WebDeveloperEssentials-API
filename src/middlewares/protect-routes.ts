import { Request, Response, NextFunction } from 'express'

function protectRoutes(req: Request, res: Response, next: NextFunction) {
  if (!res.locals.isAuth) {
    return res.status(401).json({
      message: 'Invalid input.'
    });
  }

  if (req.path.startsWith('/admin') && !res.locals.isAdmin) {
    return res.status(403).json({
      message: 'Error'
    });
  }

  next()
}

export default protectRoutes
