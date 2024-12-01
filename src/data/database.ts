import { MongoClient, Db } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

let database: Db

async function connectToDatabase(): Promise<void> {
  const uri = process.env.URI || 'localhost:'
  // const uri = 'mongodb+srv://admin:admin123!@wde.5upbwx4.mongodb.net/?retryWrites=true&w=majority&appName=wde'
  try {
    const client = await MongoClient.connect(uri)
    database = client.db('online-shop')
  } catch (err) {
    console.log(`Connection wiht Database faled: ${err}`)
    throw err
  }
}

function getDb(): Db {
  if (!database) {
    throw new Error('You must connect first!')
  }

  return database
}

export {
  connectToDatabase,
  getDb
}
