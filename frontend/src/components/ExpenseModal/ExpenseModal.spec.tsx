import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ExpenseModal from './ExpenseModal';
import { Expense } from '../../utilities/interface';

describe('ExpenseModal Component', () => {
    const mockOnClose = jest.fn();
    const mockOnSubmit = jest.fn();

    const mockExpense: Expense = {
        amount: 100,
        category: 'Meds',
        date: '2025-05-01',
        description: 'Emergency Stash',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('does not render the modal when show is false', () => {
        render(
            <ExpenseModal
                show={false}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        expect(screen.queryByText('Add New Expense')).not.toBeInTheDocument();
    });

    it('calls onClose when the close button is clicked', () => {
        render(
            <ExpenseModal
                show={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                expense={mockExpense}
            />
        );

        const closeButton = screen.getByText('×');
        fireEvent.click(closeButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });


    it('updates state when input fields are changed', () => {
        render(
            <ExpenseModal
                show={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                expense={mockExpense}
            />
        );

        const amountInput = screen.getByLabelText('amount');
        fireEvent.change(amountInput, { target: { value: '200' } });
        expect(amountInput).toHaveValue(200);

        const categoryInput = screen.getByLabelText('category');
        fireEvent.change(categoryInput, { target: { value: 'Misc.' } });
        expect(categoryInput).toHaveValue('Misc.');

        const descriptionInput = screen.getByLabelText('description');
        fireEvent.change(descriptionInput, { target: { value: 'Saftey Equipments' } });
        expect(descriptionInput).toHaveValue('Saftey Equipments');
    });

    it('calls onSubmit with the correct data when the form is submitted', () => {
        render(
            <ExpenseModal
                show={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                expense={mockExpense}
            />
        );

        const submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);

        expect(mockOnSubmit).toHaveBeenCalledWith({
            amount: 100,
            category: 'Meds',
            date: '2025-05-01',
            description: 'Emergency Stash',
        });

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('resets the form state after submission', () => {
        render(
            <ExpenseModal
                show={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                expense={mockExpense}
            />
        );

        const submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);

        expect(screen.getByLabelText('amount')).toHaveValue(0);
        expect(screen.getByLabelText('category')).toHaveValue('');
        expect(screen.getByLabelText('date')).toHaveValue('');
        expect(screen.getByLabelText('description')).toHaveValue('');
    });
});