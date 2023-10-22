const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { sendEmail } = require("../utils/helpers/sendEmail");
const { nanoid } = require("nanoid");

const { User } = require("../models/user");
const { controllerWrapper } = require("../utils/decorators/ctrlWrapper");
const { HttpError } = require("../utils/helpers/HttpError");

const { SECRET_KEY, BASE_URL } = process.env;

const avatarDir = path.join(__dirname, "../", "public", "avatars");

const registerUser = controllerWrapper(async (req, res, next) => {
  const { email, password, subscription = "starter" } = req.body;

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const verificationCode = nanoid();

  await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationCode,
  });

  const emailOptions = {
    to: email,
    subject: "Verification letter",
    html: `<a href='${BASE_URL}/users/verify/${verificationCode}'>Click verify email</a>`,
  };

  await sendEmail(emailOptions);

  res.status(201).json({ email, subscription: subscription });
});

const verifyEmail = controllerWrapper(async (req, res, next) => {
  const { verificationCode } = req.params;

  const user = await User.findOne({ verificationCode });

  if (!user) {
    throw new HttpError(401, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: "",
  });

  res.status(200).json({ message: "Email verified successfully" });
});

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new HttpError(401, "Email not found");
  }
  if (user.verify) {
    throw new HttpError(401, "Email already verified");
  }

  const emailOptions = {
    to: email,
    subject: "Verification letter",
    html: `<a hrtf='${BASE_URL}/users/verify/${user.verificationCode}'>Click verify email</a>`,
  };

  await sendEmail(emailOptions);

  res.status(200).json({ message: "Email verify send" });
};

const loginUser = controllerWrapper(async (req, res, next) => {
  const { email, password, subscription } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw new HttpError(401, "Email not verified");
  }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
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

const updateAvatar = controllerWrapper(async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultupload = path.join(avatarDir, filename);
  const image = await Jimp.read(tempUpload);
  image.resize(250, 250).quality(60);
  await image.writeAsync(resultupload);
  await fs.rename(tempUpload, resultupload);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.status(200).json({ avatarURL });
});

module.exports = {
  registerUser,
  verifyEmail,
  resendVerifyEmail,
  loginUser,
  getCurrentUser,
  logoutUser,
  updateSubscription,
  updateAvatar,
};
