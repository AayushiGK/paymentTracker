import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Cards from './Card';

describe('Cards Component', () => {
    it('renders the card with the correct label and content', () => {
        render(<Cards label="Total Expenses" content="$500" />);

        expect(screen.getByText('Total Expenses')).toBeInTheDocument();
        expect(screen.getByText('$500')).toBeInTheDocument();
    });

    it('renders the card with ReactNode content', () => {
        render(
            <Cards
                label="Categorized Expenses"
                content={
                    <ul>
                        <li>Meds: $200</li>
                        <li>Misc.: $300</li>
                    </ul>
                }
            />
        );

        expect(screen.getByText('Categorized Expenses')).toBeInTheDocument();
        expect(screen.getByText('Meds: $200')).toBeInTheDocument();
        expect(screen.getByText('Misc.: $300')).toBeInTheDocument();
    });

    it('applies the correct structure and styles', () => {
        const { container } = render(<Cards label="Test Label" content="Test Content" />);

        expect(container.querySelector('.MuiCard-root')).toBeInTheDocument();
        expect(container.querySelector('.MuiCardContent-root')).toBeInTheDocument();
        expect(container.querySelector('.MuiTypography-h5')).toBeInTheDocument();
        expect(container.querySelector('.MuiTypography-body2')).toBeInTheDocument();
    });
});