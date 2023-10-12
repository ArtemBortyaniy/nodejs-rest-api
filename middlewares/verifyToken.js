const jwt = require("jsonwebtoken");
const { HttpError } = require("../utils/helpers/HttpError");
const { User } = require("../models/user");

const { SECRET_KEY } = process.env;

const verifyToken = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new HttpError(401);
    }

    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer") {
      throw new HttpError(401);
    }

    const { userId } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(userId);

    if (!user || !user.token || user.token !== token) {
      throw new HttpError(401);
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { verifyToken };
