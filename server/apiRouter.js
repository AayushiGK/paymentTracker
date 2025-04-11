const express = require('express');
const expenseController = require('./controller/expense.controller.js');
const sessionController = require('./controller/session.controller.js');

const apiRouter = express.Router();

apiRouter.post('/login', sessionController.login);
apiRouter.post('/signup', sessionController.signup);
apiRouter.post('/expenses/add', expenseController.addExpense);
apiRouter.post('/expenses/view', expenseController.viewExpenses);
apiRouter.post('/expenses/totalByCategory', expenseController.getExpenseTotalByCategory);
apiRouter.put('/expenses/update', expenseController.editExpense);
apiRouter.delete('/expenses/delete', expenseController.deleteExpense);


module.exports = apiRouter;
