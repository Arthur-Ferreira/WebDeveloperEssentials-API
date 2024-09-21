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
    _id?: ObjectId; // Optional _id
  }

  interface ICart {
    product: Product;
    quantity: number;
    totalPrice: number;
  }

  interface IAddress {
    street: string
    postal: string
    city:string
  }

  interface IUser {
    email: string
    password: string
    fullname: string
    address: IAddress
    id?: string
    isAdmin?: boolean
  }

















}