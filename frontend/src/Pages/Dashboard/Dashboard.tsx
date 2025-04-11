import React, { useState, useEffect } from 'react';
import Cards from '../../components/Card/Card';
import ExpenseModal from '../../components/ExpenseModal/ExpenseModal';
import Header from '../../components/Header/Header';
import { addExpense, getExpenseTotalByCategory } from '../../utilities/api';
import './Dashboard.scss';
import ExpenseTable from './ExpenseTable';

const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expenses, setExpenses] = useState<{ amount: number; description: string, category: string, date: any }[]>([]);
    const email = sessionStorage.getItem('email');
    const [expenseCategoryTotal, setExpenseCategoryTotal] = useState<{ [key: string]: number }>({});


    const addExpenses = (expense: any) => {
        setExpenses((prev) => [...prev, { ...expense, id: Date.now() }]);
        email && addExpense(email, expense);
        console.log("Expense added successfully");
    };


    useEffect(() => {
        console.log(email)
        if (email) {
            getExpenseTotalByCategory(email)
                .then((data) => {
                    console.log("Fetched expenses:", data);
                    const categoryTotals = data.reduce((acc: { [key: string]: number }, item: { _id: string, totalAmount: number }) => {
                        acc[item._id] = item.totalAmount;
                        return acc;
                    }, {});
                    console.log("Category totals:", categoryTotals);
                    setExpenseCategoryTotal(categoryTotals);

                })
                .catch((error) => {
                    console.error("Error fetching expenses:", error);
                });
        } else {
            console.error("Email is null. Cannot fetch expenses.");
        }
    }, [])

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
                                    <ul>
                                        {Object.entries(expenseCategoryTotal).map(([category, total]) => (
                                            <li key={category}>
                                                {category}: ${total}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    "No categorized expenses"
                                )
                            }
                        />
                        <Cards label="Recent Expenses" content={expenses.length > 0 ? expenses[expenses.length - 1].description : "No recent expenses"} />
                    </div>
                </section>
                <ExpenseTable />
                {isModalOpen && (
                    <ExpenseModal
                        show={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={addExpenses}
                    />

                )}
            </div>
        </React.Fragment >
    );
};

export default Dashboard;
