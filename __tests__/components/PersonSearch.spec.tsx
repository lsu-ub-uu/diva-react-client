import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { PersonSearch } from '../../src/components/PersonSearch';
import { getPersons } from '../../src/control/api';

jest.mock('../../src/control/api');

const mockGetPersons = getPersons as jest.MockedFunction<typeof getPersons>;

beforeEach(() => {
	jest.clearAllTimers();
	jest.clearAllMocks();
});

describe('The PersonSearch component', () => {
	it('Shows an h1 with content "Person Search"', () => {
		render(<PersonSearch />);

		const heading = screen.getByRole('heading');
		expect(heading).toHaveTextContent('Person search');
	});

	it('Renders an input field of type text', () => {
		render(<PersonSearch />);

		const textInputs = screen.queryAllByRole('textbox');
		expect(textInputs).toHaveLength(1);
	});

	it('Renders a button with text "Search"', () => {
		render(<PersonSearch />);

		const buttons = screen.queryAllByRole('button');
		expect(buttons).toHaveLength(1);
		expect(buttons[0]).toHaveTextContent('Search');
		expect(buttons[0]).toHaveAttribute('type', 'submit');
	});

	it('Renders an empty PersonList on start', () => {
		render(<PersonSearch />);

		const lists = screen.getAllByRole('list');
		expect(lists).toHaveLength(1);
		const listItems = screen.queryAllByRole('listitem');
		expect(listItems).toHaveLength(0);
	});

	it('Renders one result if querying for something', () => {
		render(<PersonSearch />);
		mockGetPersons.mockReturnValue([
			{
				id: '1',
				authorizedName: {
					familyName: 'Anka',
					givenName: 'Kalle',
				},
			},
		]);

		const textInput = screen.getByRole('textbox');
		userEvent.type(textInput, 'something');
		const button = screen.getByRole('button');
		userEvent.click(button);
		const listItems = screen.getAllByRole('listitem');
		expect(listItems).toHaveLength(1);
		expect(listItems[0]).toHaveTextContent('1: Anka, Kalle');
	});
});
