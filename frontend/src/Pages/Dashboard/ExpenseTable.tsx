import { Box, Button, MenuItem, Select, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { BsFillTrash3Fill, BsPencilSquare } from "react-icons/bs";
import ExpenseModal from '../../components/ExpenseModal/ExpenseModal';
import { deleteExpense, editExpense } from '../../utilities/api';
import { Expense } from '../../utilities/interface';
import './ExpenseTable.scss';

const TransactionsPage = ({ expenses }: { expenses: Expense[] }) => {
    const [transactions, setTransactions] = useState(expenses);
    const [filteredTransactions, setFilteredTransactions] = useState(expenses);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [expenseModal, setExpenseModal] = useState(false);
    const [modalData, setModalData] = useState<Expense | null>(null);
    const [isDesktop, setIsDesktop] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768); // Consider 768px as the breakpoint (md breakpoint in Tailwind is 768px)
        };

        handleResize(); // Check on initial load
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    useEffect(() => {
        setTransactions(expenses);
        setFilteredTransactions(expenses);
    }, [expenses]);

    // Filter and search logic
    useEffect(() => {
        let filtered = transactions;

        // Apply search
        if (searchTerm) {
            filtered = filtered.filter((transaction) =>
                transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply category filter
        if (filterCategory) {
            filtered = filtered.filter((transaction) => transaction.category === filterCategory);
        }

        // Apply date range filter
        if (startDate) {
            filtered = filtered.filter((transaction) => new Date(transaction.date) >= new Date(startDate));
        }
        if (endDate) {
            filtered = filtered.filter((transaction) => new Date(transaction.date) <= new Date(endDate));
        }

        setFilteredTransactions(filtered);
    }, [searchTerm, filterCategory, startDate, endDate, transactions]);

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
        setExpenseModal(true);
        setModalData(transaction);
    };

    const handleUpdate = (updatedTransaction: Expense) => {
        modalData?._id && editExpense(modalData?._id, updatedTransaction)
            .then(() => {
                setTransactions((prev) =>
                    prev.map((transaction) =>
                        transaction._id === modalData?._id ? { ...transaction, ...updatedTransaction } : transaction
                    )
                );
            })
            .catch((error) => {
                console.error('Error updating transaction:', error);
            });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Transactions</h1>

            {/* Filters Section */}
            <Box display="flex" gap={2} mb={2}>
                <TextField
                    label="Search by Description"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    displayEmpty
                    variant="outlined"
                >
                    <MenuItem value="">All Categories</MenuItem>
                    {Array.from(new Set(transactions.map((t) => t.category))).map((category) => (
                        <MenuItem key={category} value={category}>
                            {category}
                        </MenuItem>
                    ))}
                </Select>
                <TextField
                    label="Start Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <TextField
                    label="End Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        setSearchTerm('');
                        setFilterCategory('');
                        setStartDate('');
                        setEndDate('');
                    }}
                >
                    Reset Filters
                </Button>
            </Box>

            <Box className="table-container">
                <table className="table">
                    <thead className="table-header">
                        <tr>
                            {isDesktop && <th>S.No</th>}
                            <th>Amount</th>
                            {isDesktop && <th>Category</th>}
                            <th>Description</th>
                            {isDesktop && <th>Date</th>}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map((transaction, index) => (
                                <tr key={transaction._id} className="table-row">
                                    {isDesktop && <td className="table-cell">{index + 1}</td>}
                                    <td className="table-cell">${transaction.amount.toFixed(2)}</td>
                                    {isDesktop && <td className="table-cell">{transaction.category}</td>}
                                    <td
                                        className="table-cell table-cell-description"
                                        title={transaction.description}
                                    >
                                        {transaction.description}
                                    </td>
                                    {isDesktop && (
                                        <td className="table-cell">
                                            {new Date(transaction.date).toLocaleDateString()}
                                        </td>
                                    )}
                                    <td className="table-cell">
                                        <Button
                                            size="small"
                                            onClick={() => handleEdit(transaction)}
                                            style={{ marginRight: '5px' }}
                                            aria-label="Edit Transaction"
                                            data-testid="Edit Transaction"
                                        >
                                            <BsPencilSquare />
                                        </Button>
                                        <Button
                                            size="small"
                                            color="error"
                                            onClick={() => transaction._id && handleDelete(transaction._id)}
                                            aria-label="Delete Transaction"
                                        >
                                            <BsFillTrash3Fill />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={isDesktop ? 6 : 3} className="table-empty-row">
                                    No transactions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Box>

            {expenseModal && (
                <ExpenseModal
                    show={expenseModal}
                    expense={modalData || undefined}
                    onClose={() => setExpenseModal(false)}
                    onSubmit={handleUpdate}
                />
            )}
        </div>
    );
};

export default TransactionsPage;