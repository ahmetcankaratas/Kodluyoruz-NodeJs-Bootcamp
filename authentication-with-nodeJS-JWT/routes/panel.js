const router = require('express').Router();
const checked = require('./checkToken');
const User = require('../model/User');

router.get('/', checked, async (req, res) => {
  const data = await User.find({});
  let userList = [];
  data.forEach(function (each) {
    userList.push(each['userName']);
  });

  res.send(`
  <h1>User List</h1>
  
  <p>
      ${userList}
  </p>

  <a href='/api/user/logout'>Logout</a>
  `);
});

module.exports = router;
