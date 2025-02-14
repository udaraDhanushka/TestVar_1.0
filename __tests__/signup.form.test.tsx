import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { SignupForm } from '../components/auth/signup-form';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

(global.fetch as jest.Mock) = jest.fn();

describe('SignupForm', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should display validation errors for invalid input', async () => {
    render(<SignupForm />);
    fireEvent.click(screen.getByText('Create Account'));

    expect(await screen.findByText('First name is too short')).toBeInTheDocument();
    expect(await screen.findByText('Password must be at least 8 characters')).toBeInTheDocument();
  });

  it('should redirect to the sign-in page upon successful registration', async () => {
    const mockRouter = { push: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn(),
    });

    render(<SignupForm />);
    fireEvent.change(screen.getByPlaceholderText('Jhon'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Doe'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('mail@example.com'), {
      target: { value: 'john.doe@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByText('Create Account'));

    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith('/auth/signin?registered=true'),
    );
  });

  it('should display a spinner while the form is submitting', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: jest.fn() });

    render(<SignupForm />);
    fireEvent.change(screen.getByPlaceholderText('Jhon'), { target: { value: 'John' } });
    fireEvent.click(screen.getByText('Create Account'));

    expect(screen.getByRole('button', { name: /Create Account/i })).toHaveClass('rounded-md');
  });
});
