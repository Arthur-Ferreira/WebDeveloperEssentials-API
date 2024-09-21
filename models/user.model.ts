import * as bcrypt from 'bcryptjs'
import mongodb from 'mongodb'
import * as db from '../data/database'

class User {
  public id?: string;
  public email: string;
  public password: string;
  public fullname: string;
  public address: IAddress;

  constructor(userData: IUser) {
    this.email = userData.email
    this.password = userData.password
    this.fullname = userData.fullname
    this.address = {
      ...userData.address
    }
    if (userData.id) {
      this.id = userData.id.toString();
    }
  }

  static async findById(userId: string): Promise<User | null> {
    const uid = new mongodb.ObjectId(userId)

    const userDb = await db
      .getDb()
      .collection<User>('users')
      .findOne({ _id: uid }, { projection: { password: 0 } })

    return userDb ? new User(userDb) : null;
  }

  getUserWithSameEmail() {
    return db.getDb().collection('users').findOne({ email: this.email })
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

  hasMatchingPassword(hashedPassword: string) {
    return bcrypt.compare(this.password, hashedPassword)
  }
}

export default User
