import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LDAPLogin from './LDAPLogin';

describe('LDAPLogin', () => {
	describe('LoginForm', () => {
		it('renders a text input for username with placeholder Användarnamn', () => {
			render(<LDAPLogin />);
			expect(
				screen.getByPlaceholderText('Användarnamn')
			).toBeInTheDocument();
		});
		it('renders a text input for password with placeholder Lösenord', () => {
			render(<LDAPLogin />);
			const passwordInput = screen.getByPlaceholderText('Lösenord');
			expect(passwordInput).toBeInTheDocument();
			expect(passwordInput).toHaveAttribute('type', 'password');
		});
		it('renders login button with text', () => {
			render(<LDAPLogin />);
			const submitButton = screen.getByRole('button', {
				name: 'Logga in på organisation',
			});
			expect(submitButton).toBeInTheDocument();

			expect(submitButton).toHaveAttribute('type', 'submit');
			expect(submitButton).toBeDisabled();
		});

		it('loginButton should not be disabled if neither username or password are empty strings', () => {
			render(<LDAPLogin />);
			const submitButton = screen.getByRole('button', {
				name: 'Logga in på organisation',
			});
			expect(submitButton).toBeDisabled();

			userEvent.type(
				screen.getByPlaceholderText('Användarnamn'),
				'someUserName'
			);
			expect(submitButton).toBeDisabled();

			userEvent.type(
				screen.getByPlaceholderText('Lösenord'),
				'somePassword'
			);
			expect(submitButton).toBeEnabled();
		});

		it('if button is clicked, do something', () => {
			render(<LDAPLogin />);
			const submitButton = screen.getByRole('button', {
				name: 'Logga in på organisation',
			});

			userEvent.type(
				screen.getByPlaceholderText('Användarnamn'),
				'someUserName'
			);

			userEvent.type(
				screen.getByPlaceholderText('Lösenord'),
				'somePassword'
			);

			userEvent.click(submitButton);
		});
	});
});
