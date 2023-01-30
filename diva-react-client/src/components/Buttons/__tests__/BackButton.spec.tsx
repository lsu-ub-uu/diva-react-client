import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BackButton from '../BackButton';

import { renderWithRouter } from '../../../../test-utils';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: () => mockedUsedNavigate,
}));

describe('BackButton.spec', () => {
	it('It renders button "Tillbaka"', () => {
		renderWithRouter(<BackButton />);
		expect(screen.getByRole('button', { name: 'Previous Tillbaka' }));
	});

	it('if button is clicked, call useNavigate', () => {
		render(<BackButton />);

		clickBackButton();

		expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
		expect(mockedUsedNavigate).toHaveBeenCalledWith(-1);
	});
});

const clickBackButton = () => {
	const backButton = screen.getByRole('button', {
		name: 'Previous Tillbaka',
	});
	userEvent.click(backButton);
};
