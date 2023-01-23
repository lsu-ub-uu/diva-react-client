import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderHook } from '@testing-library/react-hooks/dom';
import { AuthProvider, useAuth, LOGIN_STATUS } from './AuthContext';
import { Auth } from './types';

const anotherAuth: Auth = {
	status: LOGIN_STATUS.LOGGED_IN,
	token: 'someNewToken',
	idFromLogin: 'someIdFromlogin',
	deleteUrl: 'someDeleteurl',
	domain: 'someDomain',
};

const ChildComponent = function () {
	const { auth, onAuthChange } = useAuth();

	const handleClick = () => {
		onAuthChange(anotherAuth);
	};

	return (
		<>
			<p data-testid='token'>{auth.token}</p>
			<p data-testid='status'>{auth.status}</p>
			<p data-testid='idFromLogin'>{auth.idFromLogin}</p>
			<p data-testid='deleteUrl'>{auth.deleteUrl}</p>
			<button
				type='button'
				onClick={handleClick}
			>
				Click
			</button>
		</>
	);
};

describe('AuthContext', () => {
	describe('AuthProvider', () => {
		it('exists', () => {
			render(
				<AuthProvider>
					<div />
				</AuthProvider>
			);
		});

		it('renders children', () => {
			render(
				<AuthProvider>
					<h1>someChild</h1>
				</AuthProvider>
			);

			expect(
				screen.getByRole('heading', { name: 'someChild' })
			).toBeInTheDocument();
		});

		it('useAuth', () => {
			render(
				<AuthProvider>
					<ChildComponent />
				</AuthProvider>
			);

			const tokenHolder = screen.getByTestId('token');
			const statusHolder = screen.getByTestId('status');
			const idFromLoginHolder = screen.getByTestId('idFromLogin');
			const deleteUrlHolder = screen.getByTestId('deleteUrl');

			expect(tokenHolder).toHaveTextContent('');
			expect(statusHolder).toHaveTextContent(LOGIN_STATUS.LOGGED_OUT);
			expect(idFromLoginHolder).toHaveTextContent('');
			expect(deleteUrlHolder).toHaveTextContent('');

			userEvent.click(screen.getByRole('button'));

			expect(tokenHolder).toHaveTextContent(anotherAuth.token);
			expect(statusHolder).toHaveTextContent(anotherAuth.status);
			expect(idFromLoginHolder).toHaveTextContent(
				anotherAuth.idFromLogin
			);
			expect(deleteUrlHolder).toHaveTextContent(anotherAuth.deleteUrl);
		});
	});

	describe('useAuth', () => {
		it('exists', () => {
			renderHook(() => useAuth());
		});

		it('returns auth and onAuthChange', () => {
			const { result } = renderHook(() => useAuth());

			expect(result.current.auth).toStrictEqual({
				status: LOGIN_STATUS.LOGGED_OUT,
				token: '',
				idFromLogin: '',
				deleteUrl: '',
				domain: '',
			});

			expect(result.current.onAuthChange).toBeDefined();
		});

		it('calling onAuthChange without rendering AuthProvider throws error', () => {
			const { result } = renderHook(() => useAuth());

			const newAuth: Auth = {
				status: LOGIN_STATUS.LOGGED_IN,
				token: 'someToken',
				idFromLogin: 'someIdFromlogin',
				deleteUrl: 'someDeleteurl',
				domain: 'someDomain',
			};

			try {
				result.current.onAuthChange(newAuth);
			} catch (error) {
				expect(error).toStrictEqual(
					new Error(
						'useAuth can only be used within a child of AuthProvider.'
					)
				);
			}
		});

		it('calls React.useContext', () => {
			const spy = jest.spyOn(React, 'useContext');

			renderHook(() => useAuth());

			expect(spy).toHaveBeenCalledTimes(1);
		});
	});
});
