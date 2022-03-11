import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginButton from './LoginButton';
import useWebRedirectLogin from './useWebRedirectLogin';

jest.mock('./useWebRedirectLogin');
const mockUseWebRedirectLogin = useWebRedirectLogin as jest.MockedFunction<
	typeof useWebRedirectLogin
>;

const mockStartLoginProcess = jest.fn();

beforeAll(() => {
	mockUseWebRedirectLogin.mockReturnValue({
		startLoginProcess: mockStartLoginProcess,
	});
});

describe('LoginButton', () => {
	describe('Design', () => {
		it('renders a button', () => {
			render(<LoginButton />);

			expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
		});

		it('calls useWebRedirectLogin', () => {
			render(<LoginButton />);

			expect(mockUseWebRedirectLogin).toHaveBeenCalledWith(
				'http://127.0.0.1:8080/webredirect.html'
			);
		});

		it('calls startLoginProcess if button is clicked', () => {
			render(<LoginButton />);

			userEvent.click(screen.getByRole('button', { name: 'Login' }));

			expect(mockStartLoginProcess).toHaveBeenCalledTimes(1);
		});
	});
});
