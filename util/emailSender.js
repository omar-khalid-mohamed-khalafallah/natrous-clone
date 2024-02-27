/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line no-unused-vars
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //create a transporter like gmail,yahoo,etc
  const transport = nodemailer.createTransport({
    host: process.env.GMAIL_HOST,
    port: process.env.GMAIL_PORT,
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });
  const mailOption = {
    from: 'Omar Khaled <omar96136khalid@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transport.sendMail(mailOption);
};
module.exports = sendEmail;
