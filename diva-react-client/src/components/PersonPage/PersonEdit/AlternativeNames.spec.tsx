import React from 'react';
import { render, screen } from '@testing-library/react';
import { AlternativeNameForm } from './AlternativeNames';

const ComponentToTest = AlternativeNameForm;

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
				repeatable={alternativeName}
				dispatchPerson={mockDispatchPerson}
			/>
		);

		//screen.debug();

		expect(screen.getByTestId('familyName')).toHaveAttribute('value', 'anka');

		// expect(mockDispatchPerson).toHaveBeenCalledTimes(1);
	});
});
