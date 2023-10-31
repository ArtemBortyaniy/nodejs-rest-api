const nodemailer = require("nodemailer");

require("dotenv").config();

// const { META_PASSWORD } = process.env;

const config = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "artembortianiy@gmail.com",
    pass: "ptcx mcky nefy qjxl",
  },
};
const transporter = nodemailer.createTransport(config);

const sendEmail = (emailOptions) => {
  const email = {
    from: "artembortianiy@meta.com",
    ...emailOptions,
  };

  return transporter.sendMail(email);
};

module.exports = {
  sendEmail,
};
