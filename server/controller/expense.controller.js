

const ExpenseModal = require('../models/expenses.js');

const addExpense = (req, res) => {
    try {
        const { amount, description, category, date, email } = req.body;

        if (!amount || !date || !category) {
            return res.status(400).json({ message: 'Missing mandatory parameters. Please fill in the fields.' });
        }

        const expenseObj = new ExpenseModal({ amount, description, category, date, email });
        expenseObj.save().then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            return res.status(500).json({ err, message: 'Uh Oh! Something went wrong. Please try again in sometime.' });
        });
    } catch (err) {
        return res.status(500).json({ err, message: 'Uh Oh! Something went wrong. Please try again in sometime.' });
    }
}

const editExpense = (req, res) => {
    try {
        const { _id, amount, description, category, date } = req.body;

        if (!amount || !date || !category) {
            return res.status(400).json({ message: 'Missing mandatory parameters. Please fill in the fields.' });
        }

        ExpenseModal.findByIdAndUpdate(_id, { amount, description, category, date }, { new: true })
            .then((result) => {
                res.status(200).json(result);
            }).catch((err) => {
                return res.status(500).json({ err, message: 'Uh Oh! Something went wrong. Please try again in sometime.' });
            });
    } catch (err) {
        return res.status(500).json({ err, message: 'Uh Oh! Something went wrong. Please try again in sometime.' });
    }
}

const viewExpenses = (req, res) => {
    try {
        const { userId } = req.params;

        ExpenseModal.find({ userId })
            .then((result) => {
                res.status(200).json(result);
            }).catch((err) => {
                return res.status(500).json({ err, message: 'Uh Oh! Something went wrong. Please try again in sometime.' });
            });
    } catch (err) {
        return res.status(500).json({ err, message: 'Uh Oh! Something went wrong. Please try again in sometime.' });
    }
}

const deleteExpense = (req, res) => {
    try {
        const { _id } = req.body;
        ExpenseModal.findByIdAndDelete(_id)
            .then((result) => {
                res.status(200).json(result);
            }).catch((err) => {
                return res.status(500).json({ err, message: 'Uh Oh! Something went wrong. Please try again in sometime.' });
            });
    } catch (err) {
        return res.status(500).json({ err, message: 'Uh Oh! Something went wrong. Please try again in sometime.' });
    }
}

const getExpenseTotalByCategory = (req, res) => {

    console.log("Email in totalByCategory", req.body);
    try {
        console.log('getExpenseTotalByCategory', req.body);
        const { email } = req.body;

        ExpenseModal.aggregate([
            { $match: { email } },
            {
                $group: {
                    _id: "$category",
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]).then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            return res.status(500).json({ err, message: 'Uh Oh! Something went wrong. Please try again in sometime.' });
        });
    } catch (err) {
        return res.status(500).json({ err, message: 'Uh Oh! Something went wrong. Please try again in sometime.' });
    }
}


module.exports = {
    addExpense,
    viewExpenses,
    editExpense,
    deleteExpense,
    getExpenseTotalByCategory
};