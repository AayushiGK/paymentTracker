import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from './Signup';
import * as api from '../../utilities/api';
import { emailValidator } from '../../utilities/utilities';

jest.mock('../../utilities/api'); // Mock the API module
jest.mock('../../utilities/utilities'); // Mock the emailValidator function

describe('Signup Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the signup form', () => {
        render(<Signup />);

        // Check if the form elements are rendered
        expect(screen.getByText('Sign Up')).toBeInTheDocument();
        expect(screen.getByLabelText('First Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
        expect(screen.getByText('Sign-Up')).toBeInTheDocument();
        expect(screen.getByText('Already have an account?')).toBeInTheDocument();
    });

    it('shows an alert if fields are empty', () => {
        render(<Signup />);

        // Mock the alert function
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => { });

        // Click the signup button without filling the fields
        const signupButton = screen.getByText('Sign-Up');
        fireEvent.click(signupButton);

        // Check if the alert is called
        expect(alertMock).toHaveBeenCalledWith('Please fill in all fields');
    });

    it('shows an alert if the email is invalid', () => {
        (emailValidator as jest.Mock).mockReturnValue(false); // Mock emailValidator to return false

        render(<Signup />);

        // Mock the alert function
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => { });

        // Fill in the fields with an invalid email
        fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid-email' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });

        // Click the signup button
        const signupButton = screen.getByText('Sign-Up');
        fireEvent.click(signupButton);

        // Check if the alert is called
        expect(alertMock).toHaveBeenCalledWith('Please enter a valid email address');
    });

    it('shows an alert if passwords do not match', () => {
        (emailValidator as jest.Mock).mockReturnValue(true); // Mock emailValidator to return true

        render(<Signup />);

        // Mock the alert function
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => { });

        // Fill in the fields with mismatched passwords
        fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john.doe@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password456' } });

        // Click the signup button
        const signupButton = screen.getByText('Sign-Up');
        fireEvent.click(signupButton);

        // Check if the alert is called
        expect(alertMock).toHaveBeenCalledWith('Passwords do not match');
    });

    it('calls the signup API and redirects on success', async () => {
        (emailValidator as jest.Mock).mockReturnValue(true); // Mock emailValidator to return true
        (api.signup as jest.Mock).mockResolvedValue({}); // Mock signup API

        render(<Signup />);

        // Mock window.location.href
        delete (window as any).location;
        (window as any).location = { href: '' };

        // Fill in the fields
        fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john.doe@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });

        // Click the signup button
        const signupButton = screen.getByText('Sign-Up');
        fireEvent.click(signupButton);

        // Wait for the API call to resolve
        await waitFor(() => {
            expect(api.signup).toHaveBeenCalledWith('John', 'Doe', 'john.doe@example.com', 'password123', 'password123');
            expect(window.location.href).toBe('/login');
        });
    });

    it('shows an alert if the signup API fails', async () => {
        (emailValidator as jest.Mock).mockReturnValue(true); // Mock emailValidator to return true
        (api.signup as jest.Mock).mockRejectedValue(new Error('Signup failed')); // Mock signup API to throw an error

        render(<Signup />);

        // Mock the alert function
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => { });

        // Fill in the fields
        fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john.doe@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });

        // Click the signup button
        const signupButton = screen.getByText('Sign-Up');
        fireEvent.click(signupButton);

        // Wait for the API call to resolve
        await waitFor(() => {
            expect(api.signup).toHaveBeenCalledWith('John', 'Doe', 'john.doe@example.com', 'password123', 'password123');
            expect(alertMock).toHaveBeenCalledWith('Signup failed. Please check your credentials.');
        });
    });
});