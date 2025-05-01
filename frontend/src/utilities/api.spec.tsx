import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as api from './api';
import Signup from '../Pages/Signup/Signup';
import { emailValidator } from './utilities';

jest.mock('./api'); // Mock the API module
jest.mock('./utilities'); // Mock the emailValidator function

describe('Signup Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('shows an alert if fields are empty', () => {
        render(<Signup />);

        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => { });
        const signupButton = screen.getByText('Sign-Up');
        fireEvent.click(signupButton);
        expect(alertMock).toHaveBeenCalledWith('Please fill in all fields');
    });

    it('shows an alert if the email is invalid', () => {
        (emailValidator as jest.Mock).mockReturnValue(false);

        render(<Signup />);
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => { });
        fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid-email' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });

        const signupButton = screen.getByText('Sign-Up');
        fireEvent.click(signupButton);

        expect(alertMock).toHaveBeenCalledWith('Please enter a valid email address');
    });

    it('shows an alert if passwords do not match', () => {
        (emailValidator as jest.Mock).mockReturnValue(true);

        render(<Signup />);

        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => { });

        fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john.doe@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password456' } });

        const signupButton = screen.getByText('Sign-Up');
        fireEvent.click(signupButton);

        expect(alertMock).toHaveBeenCalledWith('Passwords do not match');
    });

    it('calls the signup API and redirects on success', async () => {
        (emailValidator as jest.Mock).mockReturnValue(true);
        (api.signup as jest.Mock).mockResolvedValue({});

        render(<Signup />);

        delete (window as any).location;
        (window as any).location = { href: '' };

        fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john.doe@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });

        const signupButton = screen.getByText('Sign-Up');
        fireEvent.click(signupButton);

        await waitFor(() => {
            expect(api.signup).toHaveBeenCalledWith('John', 'Doe', 'john.doe@example.com', 'password123', 'password123');
            expect(window.location.href).toBe('/login');
        });
    });

    it('shows an alert if the signup API fails', async () => {
        (emailValidator as jest.Mock).mockReturnValue(true);
        (api.signup as jest.Mock).mockRejectedValue(new Error('Signup failed'));

        render(<Signup />);

        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => { });

        fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john.doe@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });

        const signupButton = screen.getByText('Sign-Up');
        fireEvent.click(signupButton);

        await waitFor(() => {
            expect(api.signup).toHaveBeenCalledWith('John', 'Doe', 'john.doe@example.com', 'password123', 'password123');
            expect(alertMock).toHaveBeenCalledWith('Signup failed. Please check your credentials.');
        });
    });
});