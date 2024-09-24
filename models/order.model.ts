import mongodb from 'mongodb'
import * as db from '../data/database'


class Order {
  productData: ICart;
  userData: IUser;
  // Status => pending, fulfilled, cancelled
  status: 'pending' | 'fulfilled' | 'cancelled';
  formatteDate?: string;
  date: Date;
  id?: string;

  constructor(
    productData: ICart,
    userData: IUser,
    status: 'pending' | 'fulfilled' | 'cancelled' = 'pending',
    date: string | Date,
    orderId?: string
  ) {

    this.productData = productData
    this.userData = userData
    this.status = status
    this.date = date ? new Date(date) : new Date()
    this.id = orderId

    if (this.date) {
      this.formatteDate = this.date.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }
    this.id = orderId
  }

  static transformOrderDocument(orderDoc: any) {
    return new Order(
      orderDoc.productData,
      orderDoc.userData,
      orderDoc.status,
      orderDoc.date,
      orderDoc._id.toString()
    )
  }

  static transformOrderDocuments(orderDocs: any[]) {
    return orderDocs.map(this.transformOrderDocument)
  }

  static async findAll() {
    const orders = await db
      .getDb()
      .collection('orders')
      .find()
      .sort({ _id: -1 })
      .toArray()

    return this.transformOrderDocuments(orders)
  }

  static async findAllForUser(userId: string) {
    const uid = new mongodb.ObjectId(userId)

    const orders = await db
      .getDb()
      .collection('orders')
      .find({ 'userData._id': uid })
      .sort({ _id: -1 })
      .toArray()

    return this.transformOrderDocuments(orders)
  }

  static async findById(orderId: string): Promise<Order | null> {
    const order = await db
      .getDb()
      .collection('orders')
      .findOne({ _id: new mongodb.ObjectId(orderId) })

    if (!order) return null

    return this.transformOrderDocument(order)
  }

  async save(): Promise<void> {
    if (this.id) {
      const orderId = new mongodb.ObjectId(this.id)
      await db
        .getDb()
        .collection('orders')
        .updateOne({ _id: orderId }, { $set: { status: this.status } })
    } else {
      const orderDocument = {
        userData: this.userData,
        productData: this.productData,
        date: new Date(),
        status: this.status
      }

      await db.getDb().collection('orders').insertOne(orderDocument)
    }
  }
}

export default Order
