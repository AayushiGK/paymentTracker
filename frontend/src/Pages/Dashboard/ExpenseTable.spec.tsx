import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { Expense } from '../../utilities/interface';
import TransactionsPage from './ExpenseTable';

const mockExpenses: Expense[] = [
    {
        _id: 1,
        amount: 100,
        category: 'Meds',
        description: 'General Meds',
        date: '2025-05-01',
    },
    {
        _id: 2,
        amount: 200,
        category: 'Misc.',
        description: 'Saftey Equipments',
        date: '2025-05-02',
    },
];

describe('TransactionsPage Component', () => {
    it('renders the table with transactions', () => {
        render(<TransactionsPage expenses={mockExpenses} />);

        expect(screen.getByText('Amount')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.getByText('Actions')).toBeInTheDocument();

        expect(screen.getByText('$100.00')).toBeInTheDocument();
        expect(screen.getByText('General Meds')).toBeInTheDocument();
        expect(screen.getByText('$200.00')).toBeInTheDocument();
        expect(screen.getByText('Saftey Equipments')).toBeInTheDocument();
    });

    it('filters transactions by search term', () => {
        render(<TransactionsPage expenses={mockExpenses} />);

        const searchInput = screen.getByLabelText('Search by Description');
        fireEvent.change(searchInput, { target: { value: 'General Meds' } });

        expect(screen.getByText('General Meds')).toBeInTheDocument();
        expect(screen.queryByText('Saftey Equipments')).not.toBeInTheDocument();
    });

    it('filters transactions by category', () => {
        render(<TransactionsPage expenses={mockExpenses} />);

        const categorySelect = screen.getAllByRole('button'); // Material-UI renders the Select as a button
        fireEvent.mouseDown(categorySelect[0]);

        const foodOption = screen.getAllByText('Meds');
        fireEvent.click(foodOption[0]);

        expect(screen.getByText('General Meds')).toBeInTheDocument();
    });

    it('filters transactions by date range', () => {
        render(<TransactionsPage expenses={mockExpenses} />);

        const startDateInput = screen.getByLabelText('Start Date');
        fireEvent.change(startDateInput, { target: { value: '2025-05-02' } });

        expect(screen.getByText('Saftey Equipments')).toBeInTheDocument();
        expect(screen.queryByText('General Meds')).not.toBeInTheDocument();
    });

    it('resets all filters', () => {
        render(<TransactionsPage expenses={mockExpenses} />);

        const searchInput = screen.getByLabelText('Search by Description');
        fireEvent.change(searchInput, { target: { value: 'General Meds' } });

        const resetButton = screen.getByText('Reset Filters');
        fireEvent.click(resetButton);

        expect(screen.getByText('General Meds')).toBeInTheDocument();
        expect(screen.getByText('Saftey Equipments')).toBeInTheDocument();
    });

    it('handles delete transaction', () => {
        render(<TransactionsPage expenses={mockExpenses} />);

        const deleteButtons = screen.getAllByLabelText('Delete Transaction');
        fireEvent.click(deleteButtons[0]);

        expect(screen.queryByText('General Meds')).not.toBeInTheDocument();
        expect(screen.getByText('Saftey Equipments')).toBeInTheDocument();
    });

    it('handles edit transaction', () => {
        render(<TransactionsPage expenses={mockExpenses} />);

        const editButtons = screen.getAllByTestId('Edit Transaction');
        fireEvent.click(editButtons[0]);

        expect(editButtons[0]).toBeInTheDocument();
    });
});