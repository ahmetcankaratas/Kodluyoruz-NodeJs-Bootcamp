const jwt = require('jsonwebtoken');

//To protect our routes we add middleware
module.exports = function (req, res, next) {
  const token = req.cookies.token
  if (!token) {
    return res.status(401).send(`
        <p>You don't have JWT Token-Access Denied<p>
        <a href='/api/user/login'>Try Again</a>`);
  }

  const session = req.session
  if(!session.userId) {
    return res.status(401).send(`
        <p>You don't have Session ID-Access Denied<p>
        <a href='/api/user/login'>Try Again</a>`);
  }
  
  jwt.verify(token, process.env.TOKEN_SECRET,async (err, decoded) => {
    if(err){
      res.status(400).send(`<p>Invalid Token or Session</p><a href='/api/user/login'>Try Again</a>`);
    }
    if(decoded.browserJWT == session.sessionBrowser && req.headers['user-agent'] == decoded.browserJWT && req.headers['user-agent'] == session.sessionBrowser){
      next()
    }
  })
};
