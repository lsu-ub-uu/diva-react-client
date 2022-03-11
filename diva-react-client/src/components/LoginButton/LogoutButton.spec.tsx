import React from 'react';
import { render, screen } from '@testing-library/react';
import LogoutButton from './LogoutButton';

describe('LogoutButton.spec', () => {
	it('It renders button "Logout"', () => {
		render(<LogoutButton />);

		expect(screen.getByRole('button', { name: 'Logout' }));
	});
});
