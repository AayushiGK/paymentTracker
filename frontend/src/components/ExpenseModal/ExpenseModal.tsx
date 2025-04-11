import React, { useState } from "react";
import "./ExpenseModal.scss";
import { Expense } from "../../utilities/interface";

interface ExpenseModalProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (expense: Expense) => void;
    expense?: Expense; // Add optional expense property
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({ expense, show, onClose, onSubmit }) => {
    const [expenseState, setExpenseState] = useState<Expense>({
        amount: expense?.amount || 0,
        category: expense?.category || "",
        date: expense?.date || "",
        description: expense?.description || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setExpenseState((prevState) => ({
            ...prevState,
            [name]: name === "amount" ? parseFloat(value) || 0 : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(expenseState);
        onClose(); // Close modal after submission
        setExpenseState({ amount: 0, category: "", date: "", description: "" });
    };

    if (!show) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>
                <h2 className="modal-title">Add New Expense</h2>
                <form onSubmit={handleSubmit} className="modal-form">
                    <input
                        type="number"
                        name="amount"
                        placeholder="Amount"
                        value={expenseState.amount}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="category"
                        placeholder="Category"
                        value={expenseState.category}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="date"
                        name="date"
                        value={expenseState.date}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={expenseState.description}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="modal-submit">Add Expense</button>
                </form>
            </div>
        </div>
    );
};

export default ExpenseModal;