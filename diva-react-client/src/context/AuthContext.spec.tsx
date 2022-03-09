import React from 'react';
import { render, screen } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks/dom';
import { AuthProvider, useAuth, LOGIN_STATUS } from './AuthContext';
import { Auth } from './types';

const ChildComponent = function () {
	const { onAuthChange } = useAuth();

	const anotherAuth: Auth = {
		status: LOGIN_STATUS.LOGGED_IN,
		token: 'someToken',
		idFromLogin: 'someIdFromlogin',
		deleteUrl: 'someDeleteurl',
	};

	const handleClick = () => {
		onAuthChange(anotherAuth);
	};

	return (
		<button type="button" onClick={handleClick}>
			Click
		</button>
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
			const { result } = renderHook(() => useAuth());

			expect(result.current.auth).toStrictEqual({
				status: LOGIN_STATUS.LOGGED_OUT,
				token: '',
				idFromLogin: '',
				deleteUrl: '',
			});

			render(
				<AuthProvider>
					<ChildComponent />
				</AuthProvider>
			);

			expect(result.current.auth).toStrictEqual({
				status: LOGIN_STATUS.LOGGED_IN,
				token: 'someToken',
				idFromLogin: 'someIdFromlogin',
				deleteUrl: 'someDeleteurl',
			});
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
			};

			try {
				result.current.onAuthChange(newAuth);
			} catch (error) {
				expect(error).toStrictEqual(
					new Error('useAuth can only be used within a child of AuthProvider.')
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
