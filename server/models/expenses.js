const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    description: String,
    email: { type: String },
    user_Id: String,
});

module.exports = mongoose.model('expense', ExpenseSchema);