// Packages
import express from 'express';
import { Request, Response } from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import config from './config/config';
import userRoutes from './routes/userRoutes';

const app = express();

// Connect to Database
mongoose.connect(config.mongo.url, () => console.log("I'm in database"));

// sRegister view engine
app.set('view engine', 'ejs');

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(session(config.session));

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/user', userRoutes);

// First Login
app.get('/', (req: Request, res: Response) => {
  res.redirect('/user/login');
});

// Listen to Port
app.listen(3000, () => console.log('Server is running..'));
