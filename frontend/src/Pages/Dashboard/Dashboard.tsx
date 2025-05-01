import React, { useState, useEffect } from 'react';
import Cards from '../../components/Card/Card';
import ExpenseModal from '../../components/ExpenseModal/ExpenseModal';
import Header from '../../components/Header/Header';
import { addExpense, getExpenses, getExpenseTotalByCategory } from '../../utilities/api';
import './Dashboard.scss';
import ExpenseTable from './ExpenseTable';

const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expenses, setExpenses] = useState<{ amount: number; description: string, category: string, date: any }[]>([]);
    const [expenseCategoryTotal, setExpenseCategoryTotal] = useState<{ [key: string]: number }>({});

    const email = sessionStorage?.getItem('email');
    const token = sessionStorage?.getItem('token');

    const addExpenseHandler = (expense: any) => {
        setExpenses((prev) => [...prev, { ...expense, id: Date.now() }]);
        email && addExpense(email, expense).then(() => {
            // re-fetch categorized totals after adding a new expense
            getExpenseTotalByCategory(email)
                .then((data) => {
                    const categoryTotals = data.reduce((acc: { [key: string]: number }, item: { _id: string, totalAmount: number }) => {
                        acc[item._id] = item.totalAmount;
                        return acc;
                    }, {});
                    setExpenseCategoryTotal(categoryTotals); // Update the categorized totals
                })
                .catch((error) => {
                    console.error("Error fetching updated categorized totals:", error);
                });
        })
            .catch((error) => {
                console.error("Error adding expense:", error);
            });
    };

    useEffect(() => {
        if (email) {
            // Fetch all expenses
            getExpenses(email, token as string)
                .then((data) => {
                    setExpenses(data); // Set the fetched expenses
                })
                .catch((error) => {
                    console.error("Error fetching expenses:", error);
                });

            // Fetch categorized totals
            getExpenseTotalByCategory(email)
                .then((data) => {
                    const categoryTotals = data.reduce((acc: { [key: string]: number }, item: { _id: string, totalAmount: number }) => {
                        acc[item._id] = item.totalAmount;
                        return acc;
                    }, {});
                    setExpenseCategoryTotal(categoryTotals); // Set the categorized totals
                })
                .catch((error) => {
                    console.error("Error fetching categorized totals:", error);
                });
        } else {
            console.error("Email is null. Cannot fetch expenses.");
        }
    }, [email, token]);

    const totalCategoryExpenses = Object.values(expenseCategoryTotal).reduce((sum, value) => sum + value, 0);

    return (
        <React.Fragment >
            <Header userName="John Doe" /> {/* Add the Header component */}
            <div className="dashboard-container">
                <button
                    className="action-button"
                    onClick={() => setIsModalOpen(true)}
                >
                    ➕ Add Expense
                </button>
                <section className="expense-summary">
                    <div className="summary-cards">
                        <Cards label="Total Expenses" content={`$${totalCategoryExpenses}`} />
                        <Cards
                            label="Categorized Expenses"
                            content={
                                Object.entries(expenseCategoryTotal).length > 0 ? (
                                    <span><ul>
                                        {Object.entries(expenseCategoryTotal).map(([category, total]) => (
                                            <li key={category}>
                                                {category}: ${total}
                                            </li>
                                        ))}
                                    </ul>
                                    </span>
                                ) : (
                                    "No categorized expenses"
                                )
                            }
                        />
                        <Cards label="Recent Expenses" content={expenses.length > 0 ? `$${expenses[expenses.length - 1].amount} - ${expenses[expenses.length - 1].description}` : "No recent expenses"} />
                    </div>
                </section>
                <ExpenseTable expenses={expenses} />
                {isModalOpen && (
                    <ExpenseModal
                        show={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={addExpenseHandler}
                    />

                )}
            </div>
        </React.Fragment >
    );
};

export default Dashboard;
