import { ObjectId } from 'mongodb';

export { }

declare global {

  interface IProduct {
    title: string;
    summary: string;
    price: number;
    description: string;
    image?: string;
    imagePath?: string;
    imageUrl?: string;
    _id?: ObjectId | { $oid: string }
  }

  interface IAddress {
    street: string
    postalCode: string
    city: string
  }

  interface IUser {
    _id?: ObjectId | { $oid: string }
    email: string
    confirmEmail?: string
    password: string
    fullname?: string
    address?: IAddress
    isAdmin?: boolean
  }

  interface ISession {
    cookie: Object
    csrfSecret: string
    flashedData: Object
    uid: string
    isAdmin: boolean
  }

  interface IAuth {
    _id: ObjectId | { $oid: string }
    expires: Date | { $date: { $numberLong: string; }; }
    session: ISession
  }

  interface IUserData {
    _id: ObjectId | { $oid: string }
    email: string
    name: string
    address: IAddress
  }

  interface ICart {
    product: IProduct;
    quantity: number;
    totalPrice: number;
  }

  interface ItemsProducts {
    product: IProduct
    quantity: number | { $numberInt: string; }
    totalPrice: number | { $numberInt: string; }
  }

  interface IProductData {
    items: IItemsProducts[]
    totalQuantity: number | { $numberInt: string; }
    totalPrice: number | { $numberInt: string; }
  }

  interface IOrder {
    _id: ObjectId | { $oid: string }
    userData: IUserData
    productData: IProductData
    date: Date | { $date: { $numberLong: string; }; }
    status: string | "pending" | "fullfiled" | "cancelled"
  }

}