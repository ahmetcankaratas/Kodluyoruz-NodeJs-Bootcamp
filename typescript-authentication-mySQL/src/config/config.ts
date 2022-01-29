// All Configuration
import dotenv from 'dotenv';
dotenv.config();

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
  session: SESSION,
  token: TOKEN,
};

export default config;
