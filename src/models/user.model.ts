import * as bcrypt from 'bcryptjs'
import mongodb, { ObjectId } from 'mongodb'
import * as db from '../data/database'
import IUser from '../types'

class User {
  email: string;
  confirmEmail?: string;
  password: string;
  fullname?: string;
  street?: string
  postalCode?: string
  city?: string
  _id?: ObjectId | { $oid: string }
  isAdmin?: boolean

  constructor(email: string, password: string, confirmEmail?: string, fullname?: string, street?: string, postalCode?: string, city?: string, _id?: ObjectId | { $oid: string }, isAdmin?: boolean) {
    this.email = email
    this.confirmEmail = confirmEmail
    this.password = password
    this.fullname = fullname
    this.street = street
    this.postalCode = postalCode
    this.city = city
    this._id = _id
    this.isAdmin = isAdmin
  }

  static async findById(userId: string): Promise<User | null> {
    const uid = new mongodb.ObjectId(userId)

    return db
      .getDb()
      .collection<User>('users')
      .findOne({ _id: uid }, { projection: { password: 0 } })

  }

  async getUserWithSameEmail() {
    const user = await db
      .getDb()
      .collection('users')
      .findOne({ email: this.email }) as User// Casting para IUser

    return user; // Retorna já tipado como IUser
  }

  async existsAlready(): Promise<boolean> {
    const existingUser = await this.getUserWithSameEmail()
    if (existingUser) {
      return true
    }
    return false
  }

  async signup(): Promise<void> {
    const hashedPassword = await bcrypt.hash(this.password, 12)

    try {

      await db.getDb().collection('users').insertOne({
        email: this.email,
        password: hashedPassword,
        name: this.fullname,
        street: this.street,
        postalCode: this.postalCode,
        city: this.city
      })
    } catch (error: any) {
      throw new Error("Signup failed, please try again!")
    }
  }

  async hasMatchingPassword(hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(this.password, hashedPassword)
  }
}

export default User
