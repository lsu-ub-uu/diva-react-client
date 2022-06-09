import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AlternativeNames } from './AlternativeNames';

const ComponentToTest = AlternativeNames;

// todo: mock-function dispatchPerson, ändra inputfält, kolla dispatchPerson anropas korrekt

const mockDispatchPerson = jest.fn();

describe('Alernatives names component', () => {
	it('Test that the component displays the alternative names that has been sent in', () => {
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

		const inputFields = screen.getAllByRole('textbox');
		expect(inputFields[0]).toHaveAttribute('value', 'anka');
	});

	it('Test that the component calls the dispatch function after change to input', () => {
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
		const inputFields = screen.getAllByRole('textbox');
		userEvent.type(inputFields[0], 'k');
		userEvent.type(inputFields[1], 'a');
		expect(mockDispatchPerson).toHaveBeenCalledTimes(2);
	});

	it('Test the add button', () => {
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
		const addButton = screen.getAllByRole('button');
		screen.debug();
		userEvent.click(addButton[0]);
		expect(mockDispatchPerson).toHaveBeenCalledTimes(1);
	});

	it('Test the add button', () => {
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
		const trashButton = screen.getAllByRole('button');
		screen.debug();
		userEvent.click(trashButton[1]);
		expect(mockDispatchPerson).toHaveBeenCalledTimes(1);
	});
});
