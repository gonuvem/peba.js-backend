const Router = require('restify-router').Router;  
const router = new Router();
const { validateRequest } = require('../modules/validator');
const PoliticoController = require('../controllers/PoliticoController');

router.get('/:uf', validateRequest, PoliticoController.searchByUf);

module.exports = router;