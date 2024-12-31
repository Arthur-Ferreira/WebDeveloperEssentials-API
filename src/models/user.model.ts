import * as bcrypt from 'bcryptjs'
import mongodb from 'mongodb'
import * as db from '../data/database'

class User {
  email: string;
  password: string;
  fullname?: string;
  address?: IAddress

  constructor(email: string, password: string, fullname?: string, street?: string, postal?: string, city?: string) {
    this.email = email
    this.password = password
    this.fullname = fullname
    this.address = this.address
  }

  static async findById(userId: string): Promise<User | null> {
    const uid = new mongodb.ObjectId(userId)

    return db
      .getDb()
      .collection<User>('users')
      .findOne({ _id: uid }, { projection: { password: 0 } })

  }

  async getUserWithSameEmail(): Promise<IUser | null> {
    const user = await db
      .getDb()
      .collection('users')
      .findOne({ email: this.email }) as IUser | null; // Casting para IUser

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
        address: this.address
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
