import { Request, Response } from 'express'

class CustomError extends Error {
  code?: number;
}

function handleErrors(error: CustomError, req: Request, res: Response): void {
  console.log(error)

  if (error.code === 404) {
    return res.status(404).render('shared/404')
  }

  res.status(500).render('shared/500')
}

export default handleErrors
