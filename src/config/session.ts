import expressSession, { SessionOptions } from 'express-session'
import mongoDbStore from 'connect-mongodb-session'


// Funtion to create a MongoDB Session Store
function createSessionStore(): mongoDbStore.MongoDBStore {
  const MongoDBStore = mongoDbStore(expressSession)

  const store = new MongoDBStore({
    uri: process.env.URI as string,
    databaseName: 'online-shop',
    collection: 'sessions'
  })

  return store
}

function createSessionConfig(): SessionOptions {
  return {
    secret: process.env.SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000
    }
  }
}

export default createSessionConfig
