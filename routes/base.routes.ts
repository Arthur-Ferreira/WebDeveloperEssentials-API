import express, { Request, Response } from 'express'

const router = express.Router()

router.get('/', function (req: Request, res: Response) {
  res.redirect('/products')
})

router.get('/401', function (req: Request, res: Response) {
  res.status(401).render('shared/401')
})

router.get('/403', function (req: Request, res: Response) {
  res.status(403).render('shared/403')
})

export default router
