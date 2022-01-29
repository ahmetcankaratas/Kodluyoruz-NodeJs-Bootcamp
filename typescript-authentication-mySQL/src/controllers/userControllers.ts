import { Request, Response } from 'express';
import config from '../config/config';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';
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
      .render('register', { message: error.details[0].message, login: false });
  }

  // Check if user already in the DB
  const userNameCheck = await getRepository(User).findOne({
    userName: req.body.userName,
  });
  if (userNameCheck) {
    return res.status(400).render('register', {
      message: 'User name already registered',
      login: false,
    });
  }

  // Hash user password
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(req.body.password, salt);

  // Register new user
  const user = {
    name: req.body.name,
    surname: req.body.surname,
    userName: req.body.userName,
    password: hashed,
  };
  try {
    //Save new user to the database
    await getRepository(User).save(user);
    res.render('register', {
      message: 'User is created succesfully',
      login: false,
    });
  } catch (error) {
    res.status(400).render('register', { message: error, login: false });
  }
};

//Create a login Route
const login = async (req: Request, res: Response) => {
  // Validate before we send the information to DB
  const { error } = logValidation(req.body);
  if (error) {
    return res
      .status(400)
      .render('login', { message: error.details[0].message, login: false }); //BAD REQUEST
  }

  // Check if the user name exists in the DB
  const userNameExist = await getRepository(User).findOne({
    userName: req.body.userName,
  });
  if (!userNameExist) {
    return res.status(400).render('login', {
      message: "User name doesnt't exists in the Database",
      login: false,
    }); //BAD REQUEST
  }
  // Check if the password is correct
  const user: any = await getRepository(User).findOne({
    userName: req.body.userName,
  });
  const correctPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!correctPassword) {
    return res
      .status(400)
      .render('login', { message: 'incorrect password', login: false });
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

  req.session.userId = user.id;
  req.session.sessionBrowser = req.headers['user-agent'];
  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
  });

  res.redirect('/panel');
};

// Destroy Session
const logout = async (req: Request, res: Response) => {
  req!.session!.destroy((err) => {
    if (err) {
      return res.redirect('/panel');
    }
    res.clearCookie('session');
    res.clearCookie('token');
    res.redirect('/login');
  });
};

export default {
  register,
  login,
  logout,
};
