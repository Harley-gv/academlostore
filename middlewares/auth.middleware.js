const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { User } = require('../models/user.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

dotenv.config({ path: './config.env' });

const protectSession = catchAsync(async (req, res, next) => {
  let token;

  // Extract the token from headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Invalid session', 403));
  }

  // Ask JWT (library), if the token is still valid
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // Check in db that user still exists
  const user = await User.findOne({
    where: { id: decoded.id, status: 'active' },
  });

  if (!user) {
    return next(
      new AppError('The owner of this token doesnt exist anymore', 403)
    );
  }

  // Grant access
  req.sessionUser = user;
  next();
});

const protectUserAccount = (req, res, next) => {
  const { sessionUser, user } = req;

  if (sessionUser.id !== user.id) {
    return next(new AppError('You do not own this account', 403));
  }

  next();
};

const protectProduct = (req, res, next) => {
  const { sessionUser, product } = req;

  if (sessionUser.id !== product.userId) {
    return next(new AppError('You do not own this product', 403));
  }

  next();
};

module.exports = { protectSession, protectUserAccount, protectProduct };