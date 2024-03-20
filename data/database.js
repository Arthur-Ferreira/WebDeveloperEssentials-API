const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let database;

async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(process.env.URI);
    database = client.db('online-shop');
  } catch(err) {
    console.log(`Connection wiht Database faled: ${err}`)
  }
}

function getDb() {
  if (!database) {
    throw new Error('You must connect first!');
  }

  return database;
}

module.exports = {
  connectToDatabase: connectToDatabase,
  getDb: getDb
};