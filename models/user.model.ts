import * as bcrypt from 'bcryptjs'
import mongodb from 'mongodb'
import * as db from '../data/database'

class User {
  email: string;
  password: string;
  fullname?: string;
  address?: IAddress

  constructor(email: string, password: string, fullname: string, street: string, postal: string, city: string) {
    this.email = email
    this.password = password
    this.fullname = fullname
    this.address = {
      street: street,
      postal: postal,
      city: city,
    }
  }

  static async findById(userId: string): Promise<User | null> {
    const uid = new mongodb.ObjectId(userId)

    return db
      .getDb()
      .collection<User>('users')
      .findOne({ _id: uid }, { projection: { password: 0 } })

  }

  getUserWithSameEmail(email: string) {
    return db.getDb().collection('users').findOne({ email: email })
  }

  async existsAlready(): Promise<boolean> {
    const existingUser = await this.getUserWithSameEmail(this.email)
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
        address: this.address
      })
    } catch (error: any) {
      throw new Error("Signup failed, please try again!")
    }
  }

  hasMatchingPassword(hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(this.password, hashedPassword)
  }
}

export default User
