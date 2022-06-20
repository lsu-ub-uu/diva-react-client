import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OtherOrganisation from './OtherOrganisation';

const mockDispatchPerson = jest.fn();
describe('Other organization', () => {
	it('render other organization', () => {
		const aff1 = {
			name: 'Veritas University',
			fromYear: '1982',
			untilYear: '2002',
		};

		render(
			<OtherOrganisation
				otherAffiliation={aff1}
				dispatchPerson={mockDispatchPerson}
			/>
		);

		const inputFields = screen.getAllByRole('textbox');
		userEvent.type(inputFields[0], 'k');
		userEvent.type(inputFields[1], 'a');
		userEvent.type(inputFields[2], 'k');
		expect(mockDispatchPerson).toHaveBeenCalledTimes(3);
	});
});
