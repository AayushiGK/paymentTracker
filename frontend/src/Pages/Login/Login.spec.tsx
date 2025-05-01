import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as api from '../../utilities/api';
import { emailValidator } from '../../utilities/utilities';
import Login from './Login';

jest.mock('../../utilities/api'); // Mock the API module
jest.mock('../../utilities/utilities'); // Mock the emailValidator function

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form', () => {
    render(<Login />);

    // Check if the form elements are rendered
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('SignIn')).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });

  it('shows an alert if fields are empty', () => {
    render(<Login />);

    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => { });

    const loginButton = screen.getByText('SignIn');
    fireEvent.click(loginButton);

    expect(alertMock).toHaveBeenCalledWith('Please fill in all fields');
  });

  it('shows an alert if the email is invalid', () => {
    (emailValidator as jest.Mock).mockReturnValue(false); // Mock emailValidator to return false

    render(<Login />);

    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => { });

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

    const loginButton = screen.getByText('SignIn');
    fireEvent.click(loginButton);

    expect(alertMock).toHaveBeenCalledWith('Please enter a valid email address');
  });

  it('calls the login API and redirects on success', async () => {
    (emailValidator as jest.Mock).mockReturnValue(true); // Mock emailValidator to return true
    (api.login as jest.Mock).mockResolvedValue({ token: 'mockToken', email: 'test@example.com' }); // Mock login API

    render(<Login />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

    delete (window as any).location;
    (window as any).location = { href: '' };


    const loginButton = screen.getByText('SignIn');
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(sessionStorage.getItem('token')).toBe('mockToken');
      expect(sessionStorage.getItem('email')).toBe('test@example.com');
      expect(window.location.href).toBe('/dashboard');
    });
  });

  it('shows an alert if the login API fails', async () => {
    (emailValidator as jest.Mock).mockReturnValue(true); // Mock emailValidator to return true
    (api.login as jest.Mock).mockRejectedValue(new Error('Login failed')); // Mock login API to throw an error

    render(<Login />);
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => { });

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

    const loginButton = screen.getByText('SignIn');
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(alertMock).toHaveBeenCalledWith('Login failed. Please check your credentials.');
    });
  });
});