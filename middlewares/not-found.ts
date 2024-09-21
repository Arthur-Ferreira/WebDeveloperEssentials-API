import { Request, Response } from 'express'

function notFoundHandler(req: Request, res: Response): void {
  res.render('shared/404')
}

export default notFoundHandler
