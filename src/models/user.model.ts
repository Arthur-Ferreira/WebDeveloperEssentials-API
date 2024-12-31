import * as bcrypt from 'bcryptjs'
import { ObjectId } from 'mongodb'
import * as db from '../data/database'
import IAddress from '../types'

// class User {
//   email: string;
//   password: string;
//   confirmEmail?: string;
//   fullname?: string;
//   address?: IAddress;
//   _id?: ObjectId | { $oid: string }
//   isAdmin?: boolean

//   constructor(
//     email: string,
//     password: string,
//     confirmEmail?: string,
//     fullname?: string,
//     address?: IAddress,
//     _id?: ObjectId | { $oid: string },
//     isAdmin?: boolean
//   ) {
//     console.log('Constructor parameters:', email, password, confirmEmail, fullname, address, _id, isAdmin)

//     this.email = email
//     this.confirmEmail = confirmEmail
//     this.password = password
//     this.fullname = fullname
//     this.address = address
//     this._id = _id
//     this.isAdmin = isAdmin

//     console.log('User created:', this.email, this.password, this.fullname, this.address)
//   }

//   static async findById(userId: string): Promise<User | null> {
//     const uid = new mongodb.ObjectId(userId)

//     return db
//       .getDb()
//       .collection<User>('users')
//       .findOne({ _id: uid }, { projection: { password: 0 } })

//   }

//   async getUserWithSameEmail() {
//     const user = await db
//       .getDb()
//       .collection('users')
//       .findOne({ email: this.email }) as User// Casting para User

//     return user; // Retorna já tipado como User
//   }

//   async existsAlready() {
//     const existingUser = await this.getUserWithSameEmail()
//     return !!existingUser
//   }

//   async signup() {
//     const hashedPassword = await bcrypt.hash(this.password, 12)

//     try {

//       await db.getDb().collection('users').insertOne({
//         email: this.email,
//         password: hashedPassword,
//         name: this.fullname,
//         address: this.address,
//         isAdmin: this.isAdmin
//       })
//     } catch (error: any) {
//       throw new Error("Signup failed, please try again!")
//     }
//   }

//   async hasMatchingPassword(hashedPassword: string): Promise<boolean> {
//     return bcrypt.compare(this.password, hashedPassword)
//   }
// }

class User {
  email: string;
  password: string;
  fullname?: string;
  address?: IAddress;
  _id?: ObjectId | { $oid: string };
  isAdmin?: boolean;

  constructor(
    email: string,
    password: string,
    fullname?: string,
    address?: IAddress,
    _id?: ObjectId | { $oid: string },
    isAdmin?: boolean
  ) {
    this.email = email;
    this.password = password;
    this.fullname = fullname;
    this.address = address;
    this._id = _id;
    this.isAdmin = isAdmin;
  }

  // Static method to find a user by ID
  static async findById(userId: string): Promise<User | null> {
    const uid = new ObjectId(userId);
    return db
      .getDb()
      .collection<User>('users')
      .findOne({ _id: uid }, { projection: { password: 0 } });
  }

  // Fetch user by email
  async getUserWithSameEmail(): Promise<User | null> {
    return db.getDb().collection<User>('users').findOne({ email: this.email });
  }

  // Check if a user exists
  async existsAlready(): Promise<boolean> {
    return !!(await this.getUserWithSameEmail());
  }

  // Register a new user
  async signup(): Promise<void> {
    const hashedPassword = await bcrypt.hash(this.password, 12);
    const user = {
      email: this.email,
      password: hashedPassword,
      name: this.fullname,
      address: this.address,
      isAdmin: this.isAdmin,
    };

    try {
      await db.getDb().collection('users').insertOne(user);
    } catch (error) {
      throw new Error('Signup failed. Please try again.');
    }
  }

  // Compare passwords
  async hasMatchingPassword(hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(this.password, hashedPassword);
  }
}

export default User
