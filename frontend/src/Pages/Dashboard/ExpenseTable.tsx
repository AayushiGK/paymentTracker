import { useEffect, useState } from 'react';
import { BsFillTrash3Fill, BsPencilSquare } from "react-icons/bs";
import { deleteExpense, getExpenses, editExpense } from '../../utilities/api';
import './ExpenseTable.scss';
import ExpenseModal from '../../components/ExpenseModal/ExpenseModal';
import { Expense } from '../../utilities/interface';

const TransactionsPage = () => {

    const [transactions, setTransactions] = useState<Expense[]>([]);
    const [expenseModal, setExpenseModal] = useState(false);
    const [modalData, setModalData] = useState<Expense | null>(null);
    const token = sessionStorage.getItem('token');
    const email = sessionStorage.getItem('email');

    useEffect(() => {
        (email && token) && getExpenses(email, token)
            .then((data) => {
                setTransactions(data);
            })
            .catch((error) => {
                console.error('Error fetching transactions:', error);
            });
    }, [email, token]);

    const handleDelete = (_id: number) => {
        deleteExpense(_id)
            .then(() => {
                console.log('Transaction deleted successfully');
            })
            .catch((error) => {
                console.error('Error deleting transaction:', error);
            });
        setTransactions(transactions.filter((transaction) => transaction?._id !== _id));
    };

    const handleEdit = (transaction: Expense) => {
        console.log("Update transaction with _id:", transaction);
        setExpenseModal(true); // Open the modal
        setModalData(transaction); // Set the transaction data for the modal
    };

    const handleUpdate = (updatedTransaction: Expense) => {
        modalData?._id && editExpense(modalData?._id, updatedTransaction)
            .then(() => {
                setTransactions((prev) =>
                    prev.map((transaction) =>
                        transaction._id === modalData?._id ? { ...transaction, ...updatedTransaction } : transaction
                    )
                );
                console.log('Transaction updated successfully');
            })
            .catch((error) => {
                console.error('Error updating transaction:', error);
            });
    }

    return (
        <div>
            <h1>Transactions</h1>
            <table className='table'>
                <thead className='thead'>
                    <tr>
                        <th >S.No</th>
                        <th >Amount</th>
                        <th >Category</th>
                        <th >Description</th>
                        <th >Created On</th>
                        <th >Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction, index) => (
                        <tr key={index}>
                            <td data-label="S.No">{index + 1}</td>
                            <td data-label="Amount">{transaction?.amount}</td>
                            <td data-label="Category">{transaction?.category}</td>
                            <td data-label="Description">{transaction?.description.slice(0, 50)}</td>
                            <td data-label="Created On">{transaction?.date.toLocaleString()}</td>
                            <td data-label="Actions">
                                <button onClick={() => handleEdit(transaction)}>
                                    <BsPencilSquare />
                                </button>
                                <button onClick={() => transaction?._id && handleDelete(transaction?._id)}>
                                    <BsFillTrash3Fill />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {expenseModal && (
                <ExpenseModal
                    show={expenseModal}
                    expense={modalData || undefined}
                    onClose={() => setExpenseModal(false)}
                    onSubmit={handleUpdate}
                />
            )}
        </div>
    )
};

export default TransactionsPage;
