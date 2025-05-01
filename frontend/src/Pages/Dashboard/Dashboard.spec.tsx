import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as api from '../../utilities/api';
import Dashboard from './Dashboard';
import { MemoryRouter } from 'react-router';

jest.mock('../../utilities/api'); // Mock the API module

describe('Dashboard Component', () => {
    const mockExpenses = [
        { amount: 100, description: 'General Meds', category: 'Meds', date: '2025-05-01' },
        { amount: 200, description: 'Saftey Equipments', category: 'Misc.', date: '2025-05-02' },
    ];

    const mockCategoryTotals = [
        { _id: 'Meds', totalAmount: 100 },
        { _id: 'Misc.', totalAmount: 200 },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        sessionStorage.setItem('email', 'test@example.com');
        sessionStorage.setItem('token', 'mockToken');
    });

    it('renders the dashboard with summary cards and expense table', async () => {
        (api.getExpenses as jest.Mock).mockResolvedValue(mockExpenses);
        (api.getExpenseTotalByCategory as jest.Mock).mockResolvedValue(mockCategoryTotals);

        // Wrap the Dashboard component in MemoryRouter
        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        // Check if the header is rendered
        expect(screen.getByText('John Doe')).toBeInTheDocument();

        // Wait for the API calls to resolve
        await waitFor(() => {
            expect(screen.getByText('$300')).toBeInTheDocument(); // Total Expenses
            expect(screen.getByText('Meds: $100')).toBeInTheDocument(); // Categorized Expenses
            expect(screen.getByText('Misc.: $200')).toBeInTheDocument(); // Categorized Expenses
            expect(screen.getByText('$200 - Saftey Equipments')).toBeInTheDocument(); // Recent Expenses
        });

        // Check if the expense table is rendered
        expect(screen.getByText('Meds')).toBeInTheDocument();
        expect(screen.getByText('Saftey Equipments')).toBeInTheDocument();
    });

    it('opens the Add Expense modal when the button is clicked', () => {
        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        const addButton = screen.getByText('➕ Add Expense');
        fireEvent.click(addButton);

        expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('adds a new expense and updates the summary cards', async () => {
        (api.addExpense as jest.Mock).mockResolvedValue({});
        (api.getExpenseTotalByCategory as jest.Mock).mockResolvedValue([
            ...mockCategoryTotals,
            { _id: 'Entertainment', totalAmount: 50 },
        ]);

        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        const addButton = screen.getByText('➕ Add Expense');
        fireEvent.click(addButton);

        fireEvent.change(screen.getByLabelText('amount'), { target: { value: '50' } });
        fireEvent.change(screen.getByLabelText('description'), { target: { value: 'Property Tax' } });
        fireEvent.change(screen.getByLabelText('category'), { target: { value: 'Tax' } });

        const submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Property Tax')).toBeInTheDocument();
        });
    });

    it('handles API errors gracefully', async () => {
        (api.getExpenses as jest.Mock).mockRejectedValue([]);
        (api.getExpenseTotalByCategory as jest.Mock).mockRejectedValue([]);

        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/No recent expenses/i)).toBeInTheDocument();
            expect(screen.getByText(/No transactions found/i)).toBeInTheDocument();
        });
    });
});