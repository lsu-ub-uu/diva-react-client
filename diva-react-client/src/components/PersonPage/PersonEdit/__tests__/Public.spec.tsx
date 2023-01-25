import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Public from '../Public';

const mockDispatchPerson = jest.fn();
describe('Public component', () => {
	it('renders click public radio button', () => {
		render(
			<Public
				publicValue='yes'
				dispatchPerson={mockDispatchPerson}
			/>
		);
		let publicRadioButton = screen.getByLabelText('Ja');
		userEvent.click(publicRadioButton);
		publicRadioButton = screen.getByLabelText('Nej');
		userEvent.click(publicRadioButton);
		expect(mockDispatchPerson).toHaveBeenCalledTimes(1);
	});
});
