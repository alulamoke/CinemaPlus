const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization.split('Bearer ')[1];
  } else {
    return res.status(401).json({ error: 'Unauthorized.' });
  }
  try {
    const decoded = jwt.verify(token, 'mySecret');
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });
    if (!user) throw new Error();
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Token is not valid.' });
  }
};

module.exports = auth;
