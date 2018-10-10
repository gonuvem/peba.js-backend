const Router = require('restify-router').Router;  
const router = new Router();
const { validateRequest } = require('../modules/validator');
const { create, list } = require('../controllers/GlossaryController');

// router.post('', validateRequest, create);

router.get('', validateRequest, list);

module.exports = router;