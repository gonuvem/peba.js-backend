const Router = require('restify-router').Router;
const router = new Router();
const { validateRequest } = require('../modules/validator');
const { sendEmailToPolitician } = require('../controllers/MailerController');

router.post('', validateRequest, sendEmailToPolitician);

module.exports = router;