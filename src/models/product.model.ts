import { ObjectId } from 'mongodb'

import * as db from '../data/database'
import IProduct from '../types'

class CustomError extends Error {
  code?: number;
}

class Product {
  public title: string;
  public summary: string;
  public price: number;
  public description: string;
  public image?;
  public imagePath?: string;
  public imageUrl?: string;
  public id?: string; // Optional id


  constructor(productData: IProduct) {
    this.title = productData.title;
    this.summary = productData.summary;
    this.price = +productData.price;
    this.description = productData.description;
    this.image = productData.image;
    this.updateImageData();
    if (productData._id) {
      this.id = productData._id.toString();
    }
  }

  static async findById(productId: string) {
    let prodId: ObjectId;
    try {
      prodId = new ObjectId(productId);
    } catch (error: any) {
      error.code = 404;
      throw error;
    }

    const product = await db
      .getDb()
      .collection<Product>('products')
      .findOne({ _id: prodId })

    if (!product) {
      const error = new CustomError('Could not find product with provided id.')
      error.code = 404;
      throw error;
    }

    return new Product(product)
  }

  static async findAll() {
    const products = await db
      .getDb()
      .collection('products')
      .find()
      .toArray()

    return products.map((productDocument) => new Product(productDocument as IProduct))
  }


  static async findMultiple(ids: string[]) {
    const productIds = ids.map(id => new ObjectId(id))

    const products = await db
      .getDb()
      .collection<IProduct>('products')
      .find({ _id: { $in: productIds } })
      .toArray()

    return products.map(productDocument => new Product(productDocument))
  }

  updateImageData() {
    this.imagePath = `product-data/images/${this.image}`
    this.imageUrl = `/products/assets/images/${this.image}`
  }

  async save() {
    const productData = {
      title: this.title,
      summary: this.summary,
      price: this.price,
      description: this.description,
      image: this.image
    }

    if (this.id) {
      const productId = new ObjectId(this.id)

      if (!this.image) {
        delete productData.image
      }

      await db
        .getDb()
        .collection('products')
        .updateOne(
          { _id: productId },
          {
            $set: productData
          }
        )
    } else {
      await db
        .getDb()
        .collection('products')
        .insertOne(productData)
    }
  }

  replaceImage(newImage: string) {
    this.image = newImage
    this.updateImageData()
  }

  remove() {
    const productId = new ObjectId(this.id!)
    return db.getDb().collection('products').deleteOne({ _id: productId })
  }
}

export default Product
