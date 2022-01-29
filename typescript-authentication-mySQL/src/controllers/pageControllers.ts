import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';

const getIndex = async (req: Request, res: Response) => {
  // Check User if logged in
  req.session.userId
    ? res.render('index', { login: true })
    : res.render('index', { login: false });
};

const getLogin = async (req: Request, res: Response) => {
  // Check User if logged in
  req.session.userId
    ? res.render('login', { login: true, message: '' })
    : res.render('login', { login: false, message: '' });
};

const getRegister = async (req: Request, res: Response) => {
  // Check User if logged in
  req.session.userId
    ? res.render('register', { login: true, message: '' })
    : res.render('register', { login: false, message: '' });
};

// Get all registered Users
const getUsers = async (req: Request, res: Response) => {
  const data = await getRepository(User).find({});
  let userList: any = [];
  data.forEach(function (each: any) {
    userList.push(each['userName']);
  });

  res.render('panel', { userList, login: true });
};

export default {
  getUsers,
  getLogin,
  getRegister,
  getIndex,
};
