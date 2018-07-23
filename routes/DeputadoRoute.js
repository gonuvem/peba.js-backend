const Router = require('restify-router').Router;  
const router = new Router();
const DeputadoController = require('../controllers/DeputadoController');

router.get('', DeputadoController.test);

module.exports = router;