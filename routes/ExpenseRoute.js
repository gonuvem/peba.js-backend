const Router = require('restify-router').Router;  
const router = new Router();
const { validateRequest } = require('../modules/validator');
const ExpenseController = require('../controllers/ExpenseController');

router.get('', validateRequest, ExpenseController.getExpenses);

module.exports = router;