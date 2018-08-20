const Router = require('restify-router').Router;  
const router = new Router();
const { validateRequest } = require('../modules/validator');
const { searchByUf, getById } = require('../controllers/PoliticoController');

router.get('', validateRequest, searchByUf);

router.get('/:id', validateRequest, getById)

module.exports = router;