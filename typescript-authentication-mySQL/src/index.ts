// Packages
import express from 'express';
import { Request, Response } from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import config from './config/config';
import userRoutes from './routes/userRoutes';
import { createConnection } from 'typeorm';

const app = express();

// Connect to Database
createConnection().then(async () => {
  // Register view engine
  app.set('view engine', 'ejs');

  // Middlewares
  app.use(express.json());
  app.use(cookieParser());
  app.use(session(config.session));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static('public'));
  
  // Routes
  app.use('/', userRoutes);
});

// Listen to Port
app.listen(3000, () => console.log('Server is running..'));
