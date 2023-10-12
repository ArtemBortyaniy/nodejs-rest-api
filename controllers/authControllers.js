const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");

const { User } = require("../models/user");
const { controllerWrapper } = require("../utils/decorators/ctrlWrapper");
const { HttpError } = require("../utils/helpers/HttpError");

const { SECRET_KEY } = process.env;

const registerUser = controllerWrapper(async (req, res, next) => {
  const { email, password, subscription = "starter" } = req.body;

  const hashPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ ...req.body, password: hashPassword });
  const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
    expiresIn: "12h",
  });

  user.token = token;
  await user.save();
  res.status(201).json({ email, subscription: subscription });
});

const loginUser = controllerWrapper(async (req, res, next) => {
  const { email, password, subscription } = req.body;
  const user = await User.findOne({ email });
  const comparePassword = await bcrypt.compare(password, user.password);

  if (!user || !comparePassword) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const newtoken = jwt.sign({ userId: user._id }, SECRET_KEY, {
    expiresIn: "12h",
  });
  await User.findByIdAndUpdate(user._id, { token: newtoken });
  res.status(200).json({ token: newtoken, user: { email, subscription } });
});

const getCurrentUser = controllerWrapper(async (req, res) => {
  const { token } = req.user;
  res.status(200).json(token);
});

const logoutUser = controllerWrapper(async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204);
});

const updateSubscription = controllerWrapper(async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  const user = await User.findByIdAndUpdate(_id, {
    subscription: subscription,
  });
  res.status(200).json(user);
});

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  updateSubscription,
};
