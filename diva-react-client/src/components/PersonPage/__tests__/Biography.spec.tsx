import React from 'react';
import { render, screen } from '@testing-library/react';
import Biography from '../Biography';

describe('Biography', () => {
	it('should take label and string', () => {
		const { rerender } = render(
			<Biography
				label='someLabel'
				text='someText'
			/>
		);

		screen.getByRole('heading', { name: 'someLabel' });
		screen.getByText(/someText/i);

		rerender(
			<Biography
				label='someOtherLabel'
				text='someOtherText'
			/>
		);
		screen.getByRole('heading', { name: 'someOtherLabel' });
		screen.getByText(/someOtherText/i);
	});
});
