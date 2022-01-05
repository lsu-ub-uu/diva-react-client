import React from 'react';
import { MemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { PersonSearch } from '../../src/components/PersonSearch';
import { searchPersonsByNameSearch } from '../../src/control/api';
import Person from '../../src/control/Person';
import Name from '../../src/control/Name';
import CardList from '../../src/components/CardList';
import { renderWithRouter } from '../../test-utils';
import List from '../../src/control/List';

jest.mock('../../src/control/api');
jest.mock('../../src/components/CardList', () => {
	return jest.fn(() => null);
});

const mockSearchPersonsByNameSearch =
	searchPersonsByNameSearch as jest.MockedFunction<
		typeof searchPersonsByNameSearch
	>;

const personWithDomain: Person = new Person('2', new Name('Enequist', 'Gerd'));
personWithDomain.setDomains(['Uppsala Universitet', 'Test']);

const threePersonObjects: Person[] = [
	new Person('1', new Name('Anka', 'Kalle')),
	personWithDomain,
	new Person('3', new Name('Ernman', 'Malena')),
];

describe('The PersonSearch component', () => {
	it('Shows an h1 with content "Personsök"', () => {
		renderWithRouter(<PersonSearch />);

		const heading = screen.getByRole('heading');
		expect(heading.textContent).toEqual('Personsök');
	});

	it('Renders an input field of type text', () => {
		renderWithRouter(<PersonSearch />);

		const textInputs = screen.queryAllByRole('searchbox');
		expect(textInputs).toHaveLength(1);
	});

	it('Renders a button with text "Sök"', () => {
		renderWithRouter(<PersonSearch />);

		const buttons = screen.queryAllByRole('button');
		expect(buttons).toHaveLength(1);
		expect(buttons[0]).toHaveTextContent('Sök');
		expect(buttons[0]).toHaveAttribute('type', 'submit');
	});

	describe('Uses ListComponent', () => {
		it('should pass empty person array to ListComponent on start.', () => {
			renderWithRouter(<PersonSearch />);

			expect(CardList).toHaveBeenNthCalledWith(
				1,
				expect.objectContaining({
					list: [],
				}),
				expect.any(Object)
			);
		});

		it('should pass results returned by searchPersonsByNameSearch to ListComponent', async () => {
			mockSearchPersonsByNameSearch.mockResolvedValue(
				createListWithPersons(threePersonObjects)
			);
			renderWithRouter(<PersonSearch />);

			expect(CardList).toHaveBeenNthCalledWith(
				1,
				expect.objectContaining({
					list: [],
				}),
				expect.any(Object)
			);

			const inputText = screen.getByRole('searchbox');
			userEvent.type(inputText, 'someSearchTerm');

			jest.clearAllMocks();

			const button = screen.getByRole('button');
			userEvent.click(button);

			await waitFor(() => {
				expect(mockSearchPersonsByNameSearch).toHaveBeenCalledTimes(1);
			});

			expect(CardList).toHaveBeenNthCalledWith(
				1,
				expect.objectContaining({
					list: threePersonObjects,
				}),
				expect.any(Object)
			);
		});
	});

	it('Does not pass an empty searchTerm to searchPersonsByNameSearch when button is clicked', async () => {
		mockSearchPersonsByNameSearch.mockResolvedValue(
			createListWithPersons(threePersonObjects)
		);
		renderWithRouter(<PersonSearch />);

		const button = screen.getByRole('button');
		userEvent.click(button);

		await waitFor(() => {
			expect(mockSearchPersonsByNameSearch).toHaveBeenCalledTimes(0);
		});

		const inputText = screen.getByRole('searchbox');
		userEvent.clear(inputText);
		userEvent.type(inputText, 'someSearchTerm');

		userEvent.click(button);

		await assertSearchIsCalledTimesWith(1, 'someSearchTerm');
	});

	it('Passes the searchTerm typed into the input field to searchPersonsByNameSearch when button is clicked', async () => {
		mockSearchPersonsByNameSearch.mockResolvedValue(
			createListWithPersons(threePersonObjects)
		);
		renderWithRouter(<PersonSearch />);

		const inputText = screen.getByRole('searchbox');
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
		renderWithRouter(<PersonSearch />);
		mockSearchPersonsByNameSearch.mockResolvedValue(
			createListWithPersons(threePersonObjects)
		);

		const listItemsBeforeClick = screen.queryAllByRole('listitem');
		expect(listItemsBeforeClick).toHaveLength(0);

		const inputText = screen.getByRole('searchbox');
		userEvent.type(inputText, 'someSearchTerm');

		userEvent.type(inputText, '{enter}');

		await assertSearchIsCalledTimesWith(1, 'someSearchTerm');
	});

	describe('uses searchParams', () => {
		it('takes an empty searchTerm from useSearchParams', () => {
			mockSearchPersonsByNameSearch.mockResolvedValue(
				createListWithPersons(threePersonObjects)
			);

			render(
				<MemoryRouter initialEntries={['?searchTerm=']}>
					<PersonSearch />
				</MemoryRouter>
			);

			expect(mockSearchPersonsByNameSearch).toHaveBeenCalledTimes(0);
		});

		it('takes an existing searchTerm from useSearchParams and passes it to search', async () => {
			mockSearchPersonsByNameSearch.mockResolvedValue(
				createListWithPersons(threePersonObjects)
			);

			render(
				<MemoryRouter initialEntries={['?searchTerm=someSearchTerm']}>
					<PersonSearch />
				</MemoryRouter>
			);

			expect(screen.getByDisplayValue('someSearchTerm')).toBeInTheDocument();

			await waitFor(() => {
				expect(mockSearchPersonsByNameSearch).toHaveBeenCalledTimes(1);
				expect(mockSearchPersonsByNameSearch).toHaveBeenLastCalledWith(
					'someSearchTerm'
				);
			});
		});
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

function createListWithPersons(persons: Person[]) {
	return new List(persons, 1, 1, 1);
}
