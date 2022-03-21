import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import LogoutButton from './LogoutButton';
import useLogout from './useLogout';

jest.mock('./useLogout');
const mockUseLogout = useLogout as jest.MockedFunction<typeof useLogout>;

const mockLogout = jest.fn();

beforeAll(() => {
	mockUseLogout.mockReturnValue({
		logout: mockLogout,
	});
});

describe('LogoutButton.spec', () => {
	it('It renders button "Logout"', () => {
		render(<LogoutButton />);

		expect(screen.getByRole('button', { name: 'Logout' }));
	});

	it('calls useLogout', () => {
		render(<LogoutButton />);

		expect(mockUseLogout).toHaveBeenCalled();
	});

	it('if button is clicked, call useLogout.logout', () => {
		render(<LogoutButton />);

		clickLogoutButton();

		expect(mockLogout).toHaveBeenCalledTimes(1);
	});
});

const clickLogoutButton = () => {
	const logoutButton = screen.getByRole('button', { name: 'Logout' });
	userEvent.click(logoutButton);
};
