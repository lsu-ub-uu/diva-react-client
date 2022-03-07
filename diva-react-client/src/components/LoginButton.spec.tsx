import React from 'react';
import { render, screen } from '@testing-library/react';
import LoginButton from './LoginButton';

describe('LoginButton', () => {
	describe('Design', () => {
		it('renders a button', () => {
			render(<LoginButton />);

			expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
		});
	});
});
