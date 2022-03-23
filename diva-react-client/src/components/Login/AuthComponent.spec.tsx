import React from 'react';
import { render } from '@testing-library/react';
import { LOGIN_STATUS, useAuth } from '../../context/AuthContext';
import AuthComponent from './AuthComponent';
import LogoutButton from './LogoutButton';
import LoginSelector from './LoginSelector';

jest.mock('../../context/AuthContext');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

jest.mock('./LoginSelector', () => {
	return jest.fn(() => null);
});

jest.mock('./LogoutButton', () => {
	return jest.fn(() => null);
});

beforeAll(() => {
	mockUseAuth.mockReturnValue({
		auth: {
			deleteUrl: '',
			idFromLogin: '',
			status: LOGIN_STATUS.LOGGED_OUT,
			token: '',
		},
		onAuthChange: jest.fn(),
	});
});

describe('AuthComponent.spec', () => {
	it('uses useAuth', () => {
		render(<AuthComponent />);

		expect(mockUseAuth).toHaveBeenCalledTimes(1);
	});
	it('if logged out according to useAuth, render LoginButton', () => {
		render(<AuthComponent />);

		expect(LoginSelector).toHaveBeenCalledTimes(1);
	});
	it('if logged in according to useAuth, do NOT render LoginButton', () => {
		mockUseAuth.mockReturnValueOnce({
			auth: {
				deleteUrl: '',
				idFromLogin: '',
				status: LOGIN_STATUS.LOGGED_IN,
				token: '',
			},
			onAuthChange: jest.fn(),
		});

		render(<AuthComponent />);

		expect(LoginSelector).not.toHaveBeenCalled();
	});

	it('if logged out according to useAuth, do NOT render LogoutButton', () => {
		render(<AuthComponent />);

		expect(LogoutButton).not.toHaveBeenCalled();
	});
	it('if logged in according to useAuth, render LogoutButton', () => {
		mockUseAuth.mockReturnValueOnce({
			auth: {
				deleteUrl: '',
				idFromLogin: '',
				status: LOGIN_STATUS.LOGGED_IN,
				token: '',
			},
			onAuthChange: jest.fn(),
		});

		render(<AuthComponent />);

		expect(LogoutButton).toHaveBeenCalled();
	});
});
