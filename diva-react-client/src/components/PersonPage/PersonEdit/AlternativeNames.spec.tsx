import React from 'react';
import { render, screen } from '@testing-library/react';
import { AlternativeNames } from './AlternativeNames';
import userEvent from '@testing-library/user-event';

const ComponentToTest = AlternativeNames;

// todo: mock-function dispatchPerson, ändra inputfält, kolla dispatchPerson anropas korrekt

const mockDispatchPerson = jest.fn();

describe('Alernatives names component', () => {
	it('Takes alternative names', () => {
		const alternativeName = {
			content: {
				familyName: 'anka',
				givenName: 'kalle',
			},
			repeatId: 0,
		};

		render(
			<ComponentToTest
				alternativeNames={[alternativeName]}
				dispatchPerson={mockDispatchPerson}
			/>
		);

		screen.debug();
		const inputFields = screen.getAllByRole('textbox');
		expect(inputFields[0]).toHaveAttribute('value', 'anka');

		userEvent.type(inputFields[0], 'k');

		expect(mockDispatchPerson).toHaveBeenCalledTimes(1);
	});
});
