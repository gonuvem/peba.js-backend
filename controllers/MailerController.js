const { sendMail } = require('../services/mailerService');

exports.sendEmailToPolitician = async function (req, res, next) {
  try {
    // Obter email da requisição
    const email = req.body;
    
    // Enviar email
    const info = await sendMail(email);
    
    return res.send(info)
  } catch (error) {
    next(error);
  }
}