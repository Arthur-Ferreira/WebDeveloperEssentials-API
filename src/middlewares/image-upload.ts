import multer, { FileFilterCallback } from 'multer'
import { v4 as uuid } from 'uuid'
import { Request } from "express"


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'product-data/images')
  },
  filename: (req, file, cb) => {
    cb(null, uuid() + '-' + file.originalname)
  }
})

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
})

const configuredMulterMiddleware = upload.single('image')

export default configuredMulterMiddleware
