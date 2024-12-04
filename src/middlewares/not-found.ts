import { Request, Response } from 'express'

function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    message: 'Invalid input.'
  });
}

export default notFoundHandler
