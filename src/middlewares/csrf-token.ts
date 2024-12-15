import { Request, Response, NextFunction } from 'express'

function addCsrfToken(req: Request, res: Response, next: NextFunction): void {
  res.locals.csrfToken = req.csrfToken()
  // console.log(req.csrfToken())
  next()
}

export default addCsrfToken
