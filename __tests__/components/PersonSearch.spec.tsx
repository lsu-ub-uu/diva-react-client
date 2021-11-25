import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { PersonSearch } from '../../src/components/PersonSearch';
import { searchPersonsByNameSearch } from '../../src/control/api';

jest.mock('../../src/control/api');

const mockSearchPersonsByNameSearch =
	searchPersonsByNameSearch as jest.MockedFunction<
		typeof searchPersonsByNameSearch
	>;

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
		mockSearchPersonsByNameSearch.mockResolvedValue([
			{
				id: '1',
				authorizedName: {
					familyName: 'Anka',
					givenName: 'Kalle',
				},
			},
			{
				id: '2',
				authorizedName: {
					familyName: 'Enequist',
					givenName: 'Gerd',
				},
				domains: ['Uppsala Universitet', 'Test'],
			},
			{
				id: '3',
				authorizedName: {
					familyName: 'Ernman',
					givenName: 'Malena',
				},
			},
		]);
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

	it('Passes the searchTerm typed into the input field to searchPersonsByNameSearch', async () => {
		render(<PersonSearch />);
		mockSearchPersonsByNameSearch.mockResolvedValue([
			{
				id: '1',
				authorizedName: {
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

		await waitFor(() => {
			expect(mockSearchPersonsByNameSearch).toHaveBeenCalledTimes(1);
			expect(mockSearchPersonsByNameSearch).toHaveBeenLastCalledWith(
				'someSearchTerm'
			);
		});

		userEvent.clear(inputText);
		userEvent.type(inputText, 'someOtherSearchTerm');

		userEvent.click(button);

		await waitFor(() => {
			expect(mockSearchPersonsByNameSearch).toHaveBeenCalledTimes(2);
			expect(mockSearchPersonsByNameSearch).toHaveBeenLastCalledWith(
				'someOtherSearchTerm'
			);
		});
	});
});
