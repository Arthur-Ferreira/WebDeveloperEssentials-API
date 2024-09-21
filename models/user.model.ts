const bcrypt = require('bcryptjs')
const mongodb = require('mongodb')

const db = require('../data/database')

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
      street: userData.address.street,
      postal: userData.address.postal,
      city: userData.address.city
    }
    if (userData.id) {
      this.id = userData.id.toString();
    }
  }

  static findById(userId: string): Promise<User> {
    const uid = new mongodb.ObjectId(userId)

    return db
      .getDb()
      .collection('users')
      .findOne({ _id: uid }, { projection: { password: 0 } })
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

    await db.getDb().collection('users').insertOne({
      email: this.email,
      password: hashedPassword,
      name: this.fullname,
      address: this.address
    })
  }

  hasMatchingPassword(hashedPassword: any) {
    return bcrypt.compare(this.password, hashedPassword)
  }
}

module.exports = User
