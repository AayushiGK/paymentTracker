const request = require('supertest');
const express = require('express');
const { addExpense, viewExpenses, editExpense, deleteExpense, getExpenseTotalByCategory } = require('../controller/expense.controller');
const ExpenseModal = require('../models/expenses');

jest.mock('../models/expenses'); // Mock the ExpenseModal

const app = express();
app.use(express.json());

// Mock routes for testing
app.post('/addExpense', addExpense);
app.post('/viewExpenses', viewExpenses);
app.put('/editExpense', editExpense);
app.delete('/deleteExpense', deleteExpense);
app.post('/getExpenseTotalByCategory', getExpenseTotalByCategory);

describe('Expense Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('addExpense', () => {
        it('should add an expense and return 200 status', async () => {
            ExpenseModal.prototype.save = jest.fn().mockResolvedValue({
                amount: 100,
                description: 'Test Expense',
                category: 'Food',
                date: '2025-05-01',
                email: 'test@example.com',
            });

            const response = await request(app)
                .post('/addExpense')
                .send({
                    amount: 100,
                    description: 'Test Expense',
                    category: 'Food',
                    date: '2025-05-01',
                    email: 'test@example.com',
                });

            expect(response.status).toBe(200);
            expect(response.body.amount).toBe(100);
            expect(ExpenseModal.prototype.save).toHaveBeenCalled();
        });

        it('should return 400 if mandatory fields are missing', async () => {
            const response = await request(app)
                .post('/addExpense')
                .send({
                    description: 'Test Expense',
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing mandatory parameters. Please fill in the fields.');
        });

        it('should return 500 if there is a database error', async () => {
            ExpenseModal.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .post('/addExpense')
                .send({
                    amount: 100,
                    description: 'Test Expense',
                    category: 'Food',
                    date: '2025-05-01',
                    email: 'test@example.com',
                });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Uh Oh! Something went wrong. Please try again in sometime.');
        });
    });

    describe('viewExpenses', () => {
        it('should return expenses for a given email', async () => {
            ExpenseModal.find = jest.fn().mockResolvedValue([
                { amount: 100, description: 'Test Expense', category: 'Food', date: '2025-05-01', email: 'test@example.com' },
            ]);

            const response = await request(app)
                .post('/viewExpenses')
                .send({ email: 'test@example.com' });

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
            expect(ExpenseModal.find).toHaveBeenCalledWith({ email: 'test@example.com' });
        });

        it('should return 400 if email is missing', async () => {
            const response = await request(app)
                .post('/viewExpenses')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Email is required to fetch expenses.');
        });

        it('should return 500 if there is a database error', async () => {
            ExpenseModal.find = jest.fn().mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .post('/viewExpenses')
                .send({ email: 'test@example.com' });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Uh Oh! Something went wrong. Please try again in sometime.');
        });
    });

    describe('editExpense', () => {
        it('should edit an expense and return 200 status', async () => {
            ExpenseModal.findByIdAndUpdate = jest.fn().mockResolvedValue({
                _id: '123',
                amount: 200,
                description: 'Updated Expense',
                category: 'Travel',
                date: '2025-05-02',
            });

            const response = await request(app)
                .put('/editExpense')
                .send({
                    _id: '123',
                    amount: 200,
                    description: 'Updated Expense',
                    category: 'Travel',
                    date: '2025-05-02',
                });

            expect(response.status).toBe(200);
            expect(response.body.amount).toBe(200);
            expect(ExpenseModal.findByIdAndUpdate).toHaveBeenCalledWith(
                '123',
                { amount: 200, description: 'Updated Expense', category: 'Travel', date: '2025-05-02' },
                { new: true }
            );
        });

        it('should return 400 if mandatory fields are missing', async () => {
            const response = await request(app)
                .put('/editExpense')
                .send({ _id: '123' });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing mandatory parameters. Please fill in the fields.');
        });

        it('should return 500 if there is a database error', async () => {
            ExpenseModal.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .put('/editExpense')
                .send({
                    _id: '123',
                    amount: 200,
                    description: 'Updated Expense',
                    category: 'Travel',
                    date: '2025-05-02',
                });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Uh Oh! Something went wrong. Please try again in sometime.');
        });
    });

    describe('deleteExpense', () => {
        it('should delete an expense and return 200 status', async () => {
            ExpenseModal.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: '123' });

            const response = await request(app)
                .delete('/deleteExpense')
                .send({ _id: '123' });

            expect(response.status).toBe(200);
            expect(response.body._id).toBe('123');
            expect(ExpenseModal.findByIdAndDelete).toHaveBeenCalledWith('123');
        });

        it('should return 500 if there is a database error', async () => {
            ExpenseModal.findByIdAndDelete = jest.fn().mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .delete('/deleteExpense')
                .send({ _id: '123' });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Uh Oh! Something went wrong. Please try again in sometime.');
        });
    });

    describe('getExpenseTotalByCategory', () => {
        it('should return total expenses grouped by category', async () => {
            ExpenseModal.aggregate = jest.fn().mockResolvedValue([
                { _id: 'Food', totalAmount: 300 },
                { _id: 'Travel', totalAmount: 200 },
            ]);

            const response = await request(app)
                .post('/getExpenseTotalByCategory')
                .send({ email: 'test@example.com' });

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);
            expect(ExpenseModal.aggregate).toHaveBeenCalledWith([
                { $match: { email: 'test@example.com' } },
                { $group: { _id: '$category', totalAmount: { $sum: '$amount' } } },
            ]);
        });

        it('should return 500 if there is a database error', async () => {
            ExpenseModal.aggregate = jest.fn().mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .post('/getExpenseTotalByCategory')
                .send({ email: 'test@example.com' });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Uh Oh! Something went wrong. Please try again in sometime.');
        });
    });
});