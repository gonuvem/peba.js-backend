const Router = require('restify-router').Router;  
const router = new Router();
const DespesaController = require('../controllers/DespesaController');

router.get('', DespesaController.test);

module.exports = router;