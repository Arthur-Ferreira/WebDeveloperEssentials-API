import { MongoClient, Db } from 'mongodb'

let database: Db

async function connectToDatabase(): Promise<void> {
  const uri = process.env.URI || 'localhost:'
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
