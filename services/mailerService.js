const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.SENDGRID_USERNAME,
    pass: process.env.SENDGRID_PASSWORD
  }
});

function createEmail(email) {
  return {
    from: email.from,
    to: email.to,
    subject: email.subject,
    text: email.message,
  }
}

exports.sendMail = function (email) {
  return new Promise((resolve, reject) => {
    const emailOptions = createEmail(email);
    transporter.sendMail(emailOptions, (error, info) => {
      error ? reject(error) : resolve(info)
    });
  });
}
