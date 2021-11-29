import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { PersonSearch } from '../../src/components/PersonSearch';
import { searchPersonsByNameSearch } from '../../src/control/api';
import Person from '../../src/control/Person';

jest.mock('../../src/control/api');

const mockSearchPersonsByNameSearch =
	searchPersonsByNameSearch as jest.MockedFunction<
		typeof searchPersonsByNameSearch
	>;

const threePersonObjects: Person[] = [
	{
		id: '1',
		authorisedName: {
			familyName: 'Anka',
			givenName: 'Kalle',
		},
	},
	{
		id: '2',
		authorisedName: {
			familyName: 'Enequist',
			givenName: 'Gerd',
		},
		domains: ['Uppsala Universitet', 'Test'],
	},
	{
		id: '3',
		authorisedName: {
			familyName: 'Ernman',
			givenName: 'Malena',
		},
	},
];

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

	it('Renders several results returned by searchPersonsByNameSearch when clicking the submit button', async () => {
		mockSearchPersonsByNameSearch.mockResolvedValue(threePersonObjects);
		render(<PersonSearch />);

		const listItemsBeforeClick = screen.queryAllByRole('listitem');
		expect(listItemsBeforeClick).toHaveLength(0);

		const button = screen.getByRole('button');
		userEvent.click(button);

		await waitFor(() =>
			expect(mockSearchPersonsByNameSearch).toHaveBeenCalledTimes(1)
		);

		const listItems = screen.getAllByRole('listitem');
		expect(listItems).toHaveLength(3);
		expect(listItems[0]).toHaveTextContent('1: Anka, Kalle');
		expect(listItems[1]).toHaveTextContent(
			'2: Enequist, Gerd [Uppsala Universitet, Test]'
		);
		expect(listItems[2]).toHaveTextContent('3: Ernman, Malena');
	});

	it('Passes the searchTerm typed into the input field to searchPersonsByNameSearch when button is clicked', async () => {
		render(<PersonSearch />);
		mockSearchPersonsByNameSearch.mockResolvedValue([
			{
				id: '1',
				authorisedName: {
					familyName: 'Anka',
					givenName: 'Kalle',
				},
			},
		]);

		const listItemsBeforeClick = screen.queryAllByRole('listitem');
		expect(listItemsBeforeClick).toHaveLength(0);

		const inputText = screen.getByRole('textbox');
		userEvent.type(inputText, 'someSearchTerm');

		const button = screen.getByRole('button');
		userEvent.click(button);

		await assertSearchIsCalledTimesWith(1, 'someSearchTerm');

		userEvent.clear(inputText);
		userEvent.type(inputText, 'someOtherSearchTerm');

		userEvent.click(button);

		await assertSearchIsCalledTimesWith(2, 'someOtherSearchTerm');
	});

	it('Passes the searchTerm typed into the input field to searchPersonsByNameSearch when enter is clicked', async () => {
		render(<PersonSearch />);
		mockSearchPersonsByNameSearch.mockResolvedValue([
			{
				id: '1',
				authorisedName: {
					familyName: 'Anka',
					givenName: 'Kalle',
				},
			},
		]);

		const listItemsBeforeClick = screen.queryAllByRole('listitem');
		expect(listItemsBeforeClick).toHaveLength(0);

		const inputText = screen.getByRole('textbox');
		userEvent.type(inputText, 'someSearchTerm');

		userEvent.type(inputText, '{enter}');

		await assertSearchIsCalledTimesWith(1, 'someSearchTerm');
	});
});

async function assertSearchIsCalledTimesWith(
	times: number,
	searchTerm: string
) {
	return waitFor(() => {
		expect(mockSearchPersonsByNameSearch).toHaveBeenCalledTimes(times);
		expect(mockSearchPersonsByNameSearch).toHaveBeenLastCalledWith(searchTerm);
	});
}
