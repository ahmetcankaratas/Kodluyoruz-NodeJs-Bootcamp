import { Request, Response } from 'express';
import config from '../config/config';
import User from '../model/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { regValidation, logValidation } from '../validations/validation';

//Create a register route
const register = async (req: Request, res: Response) => {
  // Validate before we send the information to DB
  const { error } = regValidation(req.body);
  if (error) {
    return res
      .status(400)
      .render('message', { error: error.details[0].message });
  }

  // Check if user already in the DB
  const userNameCheck = await User.findOne({ userName: req.body.userName });
  if (userNameCheck) {
    return res
      .status(400)
      .render('message', { error: 'User name already registered' });
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
    //Save new user to the database
    const registedUser = await user.save();
    res.render('message', { error: 'User is created succesfully' });
  } catch (error) {
    res.status(400).render('message', { error: error });
  }
};
//Create a login Route
const login = async (req: Request, res: Response) => {
  // Validate before we send the information to DB
  const { error } = logValidation(req.body);
  if (error) {
    return res
      .status(400)
      .render('message', { error: error.details[0].message }); //BAD REQUEST
  }

  // Check if the user name exists in the DB
  const userNameExist = await User.findOne({ userName: req.body.userName });
  if (!userNameExist) {
    return res.status(400).render('message', {
      error: "User name doesnt't exists in the Database",
    }); //BAD REQUEST
  }
  // Check if the password is correct
  const user: any = await User.findOne({ userName: req.body.userName });
  const correctPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!correctPassword) {
    return res.status(400).render('message', { error: 'incorrect password' });
  }

  // Create JWT Token
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      _id: user._id,
      browserJWT: req.headers['user-agent'],
    },
    config.token
  );

  req!.session!.userId = user._id;
  req!.session!.sessionBrowser = req.headers['user-agent'];
  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
  });

  res.redirect('/user/panel');
};

// Destroy Session
const logout = async (req: Request, res: Response) => {
  req!.session!.destroy((err) => {
    if (err) {
      return res.redirect('/panel');
    }
    res.clearCookie('session');
    res.clearCookie('token');
    res.redirect('/user/login');
  });
};

// Get all registered Users
const getUsers = async (req: Request, res: Response) => {
  const data = await User.find({});
  let userList: any = [];
  data.forEach(function (each) {
    userList.push(each['userName']);
  });

  res.render('panel', { userList });
};

const getLogin = async (req: Request, res: Response) => {
  res.render('login');
};

const getRegister = async (req: Request, res: Response) => {
  res.render('register');
};

export default {
  register,
  login,
  logout,
  getUsers,
  getLogin,
  getRegister,
};
