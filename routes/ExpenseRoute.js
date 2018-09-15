const Router = require('restify-router').Router;  
const router = new Router();
const { validateRequest } = require('../modules/validator');
const ExpenseController = require('../controllers/ExpenseController');

router.get('', validateRequest, ExpenseController.getExpenses);

router.get('/charts', validateRequest, ExpenseController.getChartsData);

module.exports = router;