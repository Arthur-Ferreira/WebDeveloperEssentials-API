import { Request, Response } from 'express'

class CustomError extends Error {
  code?: number;
}

function handleErrors(error: CustomError, req: Request, res: Response) {
  console.log(error)

  if (error.code === 404) {
    return res.status(404).json({
      message: 'Invalid input.'
    });
  }

  res.status(404).json({
    message: 'Internal Server Error'
  });
}

export default handleErrors
