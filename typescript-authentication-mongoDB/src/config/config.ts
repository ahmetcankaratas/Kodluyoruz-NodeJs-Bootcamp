// All Configuration
import dotenv from 'dotenv';
dotenv.config();

//MongoDB
const MONGO_URI =
  process.env.DB || `cluster0.menvh.mongodb.net/sample?w=majority`;

const MONGO = {
  options: '',
  url: MONGO_URI,
};

//Session
const SESSION = {
  name: 'session',
  key: 'session',
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET || '',
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 Hour
  },
};

const TOKEN = process.env.TOKEN_SECRET || '';

const config = {
  mongo: MONGO,
  session: SESSION,
  token: TOKEN,
};

export default config;
