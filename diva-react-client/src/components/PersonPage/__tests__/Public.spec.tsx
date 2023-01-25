import React from 'react';
import { render, screen } from '@testing-library/react';
import Public from '../Public';

describe('Public', () => {
	it('Displays heading', () => {
		render(<Public isPublic='yes' />);

		expect(
			screen.getByRole('heading', { name: 'Publik' })
		).toBeInTheDocument();
	});

	it('Displays ja/nej depending on input', () => {
		const { rerender } = render(<Public isPublic='yes' />);

		expect(screen.getByText('Ja')).toBeInTheDocument();
		expect(screen.queryByText('Nej')).not.toBeInTheDocument();

		rerender(<Public isPublic='no' />);

		expect(screen.getByText('Nej')).toBeInTheDocument();
		expect(screen.queryByText('Ja')).not.toBeInTheDocument();
	});
});
