import React from 'react';
import { render, screen } from '@testing-library/react';
import LogoutButton from './LogoutButton';
import { LOGIN_STATUS, useAuth } from '../../context/AuthContext';
import userEvent from '@testing-library/user-event';

jest.mock('../../context/AuthContext');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

beforeAll(() => {
	mockUseAuth.mockReturnValue({
		auth: {
			deleteUrl: 'someDeleteUrl',
			idFromLogin: 'someId',
			status: LOGIN_STATUS.LOGGED_IN,
			token: 'someToken',
		},
		onAuthChange: jest.fn(),
	});
});

describe('LogoutButton.spec', () => {
	it('It renders button "Logout"', () => {
		render(<LogoutButton />);

		expect(screen.getByRole('button', { name: 'Logout' }));
	});

	it('calls useAuth', () => {
		render(<LogoutButton />);

		expect(mockUseAuth).toHaveBeenCalled();
	});

	it('if button is clicked, call fetch with auth.deleteUrl', () => {
		render(<LogoutButton />);

		clickLogoutButton();
	});
});

const clickLogoutButton = () => {
	const logoutButton = screen.getByRole('button', { name: 'Logout' });
	userEvent.click(logoutButton);
};
