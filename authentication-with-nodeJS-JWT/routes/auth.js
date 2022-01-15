const router = require('express').Router();
const User = require('../model/User');
const { regValidation, logValidation } = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Create a register route
//Routing refers to how an application’s endpoints (URIs) respond to client requests
router.post('/register', async (req, res) => {
  // Validate before we send the information to DB
  const { error } = regValidation(req.body);
  if (error) {
    return res.status(400).
    send(`<p>${error.details[0].message}</p><a href='/api/user/register'>Back</a>`); //BAD REQUEST
  }

  // Check if user already in the DB
  const userNameCheck = await User.findOne({ userName: req.body.userName });
  if (userNameCheck) {
    return res
      .status(400)
      .send(
        `<p>User name already registered</p><a href='/api/user/register'>Back</a>`
      );
  }

  // Hash user password
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(req.body.password, salt);

  // Register new user
  const user = new User({
    name: req.body.name,
    surname: req.body.surname,
    userName: req.body.userName,
    password: hashed,
  });
  try {
    const registedUser = await user.save();
    //The save() function is used to save the document to the database.
    res.send(`<p>User is created succesfully</p><a href='login'>Login</a>`);
  } catch (error) {
    res.status(400).send(error);
  }
});

//Create a login Route
router.post('/login', async (req, res) => {
  // Validate before we send the information to DB
  const { error } = logValidation(req.body);
  if (error) {
    return res.status(400)
    .send(`<p>${error.details[0].message}</p><a href='/api/user/login'>Back</a>`); //BAD REQUEST
  }

  // Check if the user name exists in the DB
  const userNameExist = await User.findOne({ userName: req.body.userName });
  if (!userNameExist) {
    return res
      .status(400)
      .send(
        `<p>User name doesnt't exists in the Database</p><a href='login'>Back</a>`
      );
  }
  // Check if the password is correct
  const user = await User.findOne({ userName: req.body.userName });
  const correctPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!correctPassword) {
    return res
      .status(400)
      .send(`<p>incorrect password</p><a href='login'>Back</a>`);
  }

  // Create JWT Token
  //JSON Web Tokens are an open, industry standard RFC 7519 method for representing claims securely between two parties.
  //Synchronous Sign with default (HMAC SHA256)
  //Signing a token with 1 hour of expiration:
  //jwt.sign(payload, secretOrPrivateKey, [options, callback])
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      _id: user._id,
      browserJWT: req.headers['user-agent'],
    },
    process.env.TOKEN_SECRET
  );

  req.session.userId = user._id;
  req.session.sessionBrowser = req.headers['user-agent'];
  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
  });

  res.redirect('/api/panel');
});

// Destroy Session
router.get('/logout', async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/api/panel');
    }
    res.clearCookie('session');
    res.clearCookie('token');
    res.redirect('/api/user/login');
  });
});

// Pages
router.get('/login', (req, res) => {
  res.send(`
  <h1>Login</h1>
  
  <form method='post' action='login'>
      <input type='text' name='userName' placeholder='User Name' required />
      <input type='password' name='password' placeholder='Password' required />
      <input type='submit' />
  </form>
  <a href='register'>Register</a>
  `);
});

router.get('/register', (req, res) => {
  res.send(`
  <h1>Register</h1>
  
  <form method='post' action='register'>
      <input type='text' name='name' placeholder='Name' required />
      <input type='text' name='surname' placeholder='Surname' required />
      <input type='text' name='userName' placeholder='User Name' required />
      <input type='password' name='password' placeholder='Password' required />
      <input type='submit' />
  </form>
  <a href='login'>Login</a>
  `);
});

module.exports = router;

/*references:
https://expressjs.com/en/guide/routing.html
https://www.geeksforgeeks.org/mongoose-save-function/
https://joi.dev/api/?v=17.5.0
https://jwt.io/
https://www.npmjs.com/package/jsonwebtoken
*/
