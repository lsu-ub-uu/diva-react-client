import React from 'react';
import { render, screen } from '@testing-library/react';
import SearchButton from '../SearchButton';

describe('SearchButton.test', () => {
	it('It renders button "Sök"', () => {
		render(<SearchButton />);
		expect(screen.getByRole('button', { name: 'Sök' }));
	});
});
