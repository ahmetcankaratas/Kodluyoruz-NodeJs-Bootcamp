import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import config from '../config/config';

//To protect our routes we add middleware
const autControl = function (req: Request, res: Response, next: NextFunction) {
  const token: string = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .render('message', { error: "You don't have JWT Token-Access Denied" });
  }

  const session: any = req.session;
  if (!session.userId) {
    return res
      .status(401)
      .render('message', { error: "You don't have Session ID-Access Denied" });
  }

  jwt.verify(token, config.token, async (err: any, decoded: any) => {
    if (err) {
      res.status(400).render('message', { error: 'Invalid Token or Session' });
    }
    if (
      decoded.browserJWT == session.sessionBrowser &&
      req.headers['user-agent'] == decoded.browserJWT &&
      req.headers['user-agent'] == session.sessionBrowser
    ) {
      next();
    }
  });
};

export default autControl;
