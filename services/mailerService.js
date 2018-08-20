const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'moitaneto@gmail.com',
    pass: ''
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
