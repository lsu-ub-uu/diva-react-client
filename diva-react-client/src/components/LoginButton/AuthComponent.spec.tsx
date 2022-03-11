import React from 'react';
import { render } from '@testing-library/react';
import { LOGIN_STATUS, useAuth } from '../../context/AuthContext';
import AuthComponent from './AuthComponent';
import LoginButton from './LoginButton';

jest.mock('../../context/AuthContext');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

jest.mock('./LoginButton', () => {
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

		expect(LoginButton).toHaveBeenCalledTimes(1);
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

		expect(LoginButton).not.toHaveBeenCalled();
	});
	it.todo('if logged out according to useAuth, do NOT render LogoutButton');
	it.todo('if logged in according to useAuth, render LogoutButton (WIP!)');
});
