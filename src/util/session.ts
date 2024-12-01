import session, { SessionOptions } from 'express-session';
import connectMongoDBSession from 'connect-mongodb-session';

function createSessionStore(): connectMongoDBSession.MongoDBStore {
  const MongoDBStore = connectMongoDBSession(session);

  const store = new MongoDBStore({
    uri: process.env.URI || '',
    databaseName: 'online-shop',
    collection: 'sessions',
  });

  store.on('error', (error: Error) => {
    console.error('Session Store Error:', error);
  });

  return store;
}

function createSessionConfig(): SessionOptions {
  return {
    secret: process.env.SECRET || 'default-secret',
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    },
  };
}

export default createSessionConfig;