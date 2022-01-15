// Gusto & RemoteTeam Node.js Bootcamp
// Assignment # 2
// Ahmet Can Karataş

// Packages
const express = require('express');
const session = require('express-session');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
dotenv.config();

// Import Auth Route
const authRoute = require('./routes/auth');
const panelRoute = require('./routes/panel');
// Connect to Database
// .env should be in .gitignore but for assignment I especially left there.

mongoose.connect(process.env.DB, () => console.log("I'm in database"));

// Middlewares
// Middleware is software that lies between an operating system and the applications running on it.
// Middleware functions are functions that have access to the request object (req), the response object (res)

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    name: 'session',
    key: 'session',
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 Hour
    },
  })
);
//This is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/user', authRoute);
app.use('/api/panel', panelRoute);

//adding prefex

// Pages
app.get('/', (req, res) => {
  res.redirect('/api/user/login')
});

// Listen to Port
app.listen(3000, () => console.log('Server is running..'));

/*references:
//nodemon is a tool that helps develop node.js based applications by 
automatically restarting the node application when file changes in the directory are detected.
http://expressjs.com/en/guide/using-middleware.html#using-middleware
https://www.npmjs.com/package/nodemon
https://expressjs.com/en/api.html
https://www.npmjs.com/package/express-session
*/
