const nodemailer = require("nodemailer");

require("dotenv").config();

const { META_PASSWORD } = process.env;

const sendEmail = (emailOptions) => {
  const config = {
    host: "smtp.meta.ua",
    port: 465,
    secure: true,
    auth: {
      user: "artembortianiy@meta.ua",
      pass: META_PASSWORD,
    },
  };
  const transporter = nodemailer.createTransport(config);

  transporter
    .sendMail({
      from: "artembortianiy@meta.ua",
      ...emailOptions,
    })
    .then((info) => console.log(info))
    .catch((err) => console.log(err));
};

module.exports = {
  sendEmail,
};
