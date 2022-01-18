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
import PaginationComponent from '../../src/components/PaginationComponent';
import SearchComponent from '../../src/components/SearchComponent';

let stringToSendToOnValueChange = '';

jest.mock('../../src/components/SearchComponent', () => {
	return jest.fn((props: { onSubmit: Function; onValueChange: Function }) => {
		return (
			<>
				<button
					type="button"
					onClick={() => {
						props.onSubmit();
					}}
				>
					callOnSubmit
				</button>
				<button
					type="button"
					onClick={() => {
						props.onValueChange(stringToSendToOnValueChange);
					}}
				>
					callOnValueChange
				</button>
			</>
		);
	});
});

jest.mock('../../src/control/api');
jest.mock('../../src/components/CardList', () => {
	return jest.fn(() => null);
});

let startValueForTest = 333;
let rowsValueForTest = 666;

jest.mock('../../src/components/PaginationComponent', () => {
	return jest.fn((props: { onPaginationUpdate: Function }) => {
		return (
			<button
				type="button"
				onClick={() => {
					props.onPaginationUpdate(startValueForTest, rowsValueForTest);
				}}
			>
				CallPaginationUpdate
			</button>
		);
	});
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

	it('Uses the SearchComponent', () => {
		renderWithRouter(<PersonSearch />);

		expect(SearchComponent).toHaveBeenCalledTimes(1);
		expect(SearchComponent).toHaveBeenLastCalledWith(
			expect.objectContaining({ value: '' }),
			expect.any(Object)
		);
	});

	describe('Uses CardList', () => {
		it('should not render CardList if no List is present', () => {
			renderWithRouter(<PersonSearch />);

			expect(CardList).toHaveBeenCalledTimes(0);
		});

		it('should pass results returned by searchPersonsByNameSearch to CardList', async () => {
			mockSearchPersonsByNameSearch.mockResolvedValue(
				createListWithPersons(threePersonObjects)
			);
			renderWithRouter(<PersonSearch />);

			expect(CardList).toHaveBeenCalledTimes(0);

			stringToSendToOnValueChange = 'someSearchTerm';
			const onValueChangeButton = screen.getByRole('button', {
				name: 'callOnValueChange',
			});
			userEvent.click(onValueChangeButton);

			const submitButton = screen.getByRole('button', { name: 'callOnSubmit' });
			userEvent.click(submitButton);

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

	describe('uses URL to store state', () => {
		it('Does not pass an empty searchTerm to searchPersonsByNameSearch when handleSubmit is called', async () => {
			mockSearchPersonsByNameSearch.mockResolvedValue(
				createListWithPersons(threePersonObjects)
			);
			renderWithRouter(<PersonSearch />);

			simulateSearchComponentSubmit();

			await waitFor(() => {
				expect(mockSearchPersonsByNameSearch).toHaveBeenCalledTimes(0);
			});

			simulateSearchComponentTextInput('someSearchTerm');

			simulateSearchComponentSubmit();

			await assertSearchIsCalledTimesWithGivenSearchTermAndDefaultStartRows(
				1,
				'someSearchTerm'
			);
		});

		it('Passes the searchTerm typed into the input field to searchPersonsByNameSearch when handleSubmit is called', async () => {
			mockSearchPersonsByNameSearch.mockResolvedValue(
				createListWithPersons(threePersonObjects)
			);
			renderWithRouter(<PersonSearch />);

			simulateSearchComponentTextInput('someSearchTerm');
			simulateSearchComponentSubmit();

			await assertSearchIsCalledTimesWithGivenSearchTermAndDefaultStartRows(
				1,
				'someSearchTerm'
			);

			simulateSearchComponentTextInput('someOtherSearchTerm');
			simulateSearchComponentSubmit();

			await assertSearchIsCalledTimesWithGivenSearchTermAndDefaultStartRows(
				2,
				'someOtherSearchTerm'
			);
		});

		describe('uses searchParams', () => {
			it('takes an empty searchTerm from useSearchParams and does not pass it to search', () => {
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

			it('takes an existing searchTerm from useSearchParams and passes it to search, passes default values 1 and 100 for start/rows', async () => {
				mockSearchPersonsByNameSearch.mockResolvedValue(
					createListWithPersons(threePersonObjects)
				);

				render(
					<MemoryRouter initialEntries={['?searchTerm=someSearchTerm']}>
						<PersonSearch />
					</MemoryRouter>
				);

				expect(SearchComponent).toHaveBeenLastCalledWith(
					expect.objectContaining({ value: 'someSearchTerm' }),
					expect.any(Object)
				);

				await waitFor(() => {
					expect(mockSearchPersonsByNameSearch).toHaveBeenCalledTimes(1);
					expect(mockSearchPersonsByNameSearch).toHaveBeenLastCalledWith(
						'someSearchTerm',
						1,
						100
					);
				});
			});

			it('does not call search if no searchTerm is provided, even though start and rows are given', () => {
				mockSearchPersonsByNameSearch.mockResolvedValue(
					createListWithPersons(threePersonObjects)
				);

				render(
					<MemoryRouter initialEntries={['?start=1&rows=10']}>
						<PersonSearch />
					</MemoryRouter>
				);

				expect(mockSearchPersonsByNameSearch).toHaveBeenCalledTimes(0);
			});

			it('passes a positive start value to search', async () => {
				mockSearchPersonsByNameSearch.mockResolvedValue(
					createListWithPersons(threePersonObjects)
				);

				render(
					<MemoryRouter initialEntries={['?searchTerm=someSearchTerm&start=3']}>
						<PersonSearch />
					</MemoryRouter>
				);

				await waitFor(() => {
					expect(mockSearchPersonsByNameSearch).toHaveBeenCalledTimes(1);
					expect(mockSearchPersonsByNameSearch).toHaveBeenLastCalledWith(
						'someSearchTerm',
						3,
						100
					);
				});
			});

			it('passes a positive rows value to search', async () => {
				mockSearchPersonsByNameSearch.mockResolvedValue(
					createListWithPersons(threePersonObjects)
				);

				render(
					<MemoryRouter initialEntries={['?searchTerm=someSearchTerm&rows=4']}>
						<PersonSearch />
					</MemoryRouter>
				);

				await waitFor(() => {
					expect(mockSearchPersonsByNameSearch).toHaveBeenCalledTimes(1);
					expect(mockSearchPersonsByNameSearch).toHaveBeenLastCalledWith(
						'someSearchTerm',
						1,
						4
					);
				});
			});

			it('passes start 1, row 100 to search if given strings', async () => {
				mockSearchPersonsByNameSearch.mockResolvedValue(
					createListWithPersons(threePersonObjects)
				);

				render(
					<MemoryRouter
						initialEntries={['?searchTerm=someSearchTerm&start=asdf&rows=asdf']}
					>
						<PersonSearch />
					</MemoryRouter>
				);

				await waitFor(() => {
					expect(mockSearchPersonsByNameSearch).toHaveBeenCalledTimes(1);
					expect(mockSearchPersonsByNameSearch).toHaveBeenLastCalledWith(
						'someSearchTerm',
						1,
						100
					);
				});
			});

			it('passes start 1, rows 100 to search if given negative numbers', async () => {
				mockSearchPersonsByNameSearch.mockResolvedValue(
					createListWithPersons(threePersonObjects)
				);

				render(
					<MemoryRouter
						initialEntries={['?searchTerm=someSearchTerm&start=-1&rows=-1']}
					>
						<PersonSearch />
					</MemoryRouter>
				);

				await waitFor(() => {
					expect(mockSearchPersonsByNameSearch).toHaveBeenCalledTimes(1);
					expect(mockSearchPersonsByNameSearch).toHaveBeenLastCalledWith(
						'someSearchTerm',
						1,
						100
					);
				});
			});

			it('passes start 1, rows 100 to search if given 0s', async () => {
				mockSearchPersonsByNameSearch.mockResolvedValue(
					createListWithPersons(threePersonObjects)
				);

				render(
					<MemoryRouter
						initialEntries={['?searchTerm=someSearchTerm&start=0&rows=0']}
					>
						<PersonSearch />
					</MemoryRouter>
				);

				await waitFor(() => {
					expect(mockSearchPersonsByNameSearch).toHaveBeenCalledTimes(1);
					expect(mockSearchPersonsByNameSearch).toHaveBeenLastCalledWith(
						'someSearchTerm',
						1,
						100
					);
				});
			});
		});
	});

	describe('pagination', () => {
		it('should not render the PaginationComponent if no List is present', () => {
			renderWithRouter(<PersonSearch />);

			expect(PaginationComponent).toHaveBeenCalledTimes(0);
		});

		it('should pass totalNumber returned by searchPersonsByNameSearch triggered by manual search as well as start/rows to PaginationComponent', async () => {
			mockSearchPersonsByNameSearch.mockResolvedValue(
				createListWithPersons(threePersonObjects)
			);
			renderWithRouter(<PersonSearch />);

			expect(PaginationComponent).toHaveBeenCalledTimes(0);

			simulateSearchComponentTextInput('someSearchTerm');
			simulateSearchComponentSubmit();

			await waitFor(() => {
				expect(mockSearchPersonsByNameSearch).toHaveBeenCalledTimes(1);
			});

			expect(PaginationComponent).toHaveBeenLastCalledWith(
				expect.objectContaining({
					start: 1,
					rows: 100,
					totalNumber: 6,
					onPaginationUpdate: expect.any(Function),
				}),
				expect.any(Object)
			);
		});

		it('should pass totalNumber returned by searchPersonsByNameSearch triggered by URL search as well as start/rows to PaginationComponent', async () => {
			const expectedTotalNumber = 400;
			const mockList = new List(threePersonObjects, 1, 3, expectedTotalNumber);
			mockSearchPersonsByNameSearch.mockResolvedValue(mockList);

			const expectedStart = 5;
			const expectedRows = 20;

			render(
				<MemoryRouter
					initialEntries={[
						`?searchTerm=someSearchTerm&start=${expectedStart}&rows=${expectedRows}`,
					]}
				>
					<PersonSearch />
				</MemoryRouter>
			);

			await waitFor(() => {
				expect(mockSearchPersonsByNameSearch).toHaveBeenCalledTimes(1);
			});

			expect(PaginationComponent).toHaveBeenLastCalledWith(
				expect.objectContaining({
					start: expectedStart,
					rows: expectedRows,
					totalNumber: expectedTotalNumber,
					onPaginationUpdate: expect.any(Function),
				}),
				expect.any(Object)
			);
		});

		it('should pass a function "onPaginationUpdate", that takes start/rows and calls searchPersonsByNameSearch with the new values', async () => {
			const mockList = new List(threePersonObjects, 1, 3, 400);
			mockSearchPersonsByNameSearch.mockResolvedValue(mockList);

			render(
				<MemoryRouter
					initialEntries={['?searchTerm=someSearchTerm&start=5&rows=20']}
				>
					<PersonSearch />
				</MemoryRouter>
			);

			await waitFor(() => {
				expect(mockSearchPersonsByNameSearch).toHaveBeenCalledTimes(1);
			});

			expect(PaginationComponent).toHaveBeenCalledTimes(1);

			const callUpdateButton = screen.getByRole('button', {
				name: 'CallPaginationUpdate',
			});

			userEvent.click(callUpdateButton);

			await waitFor(() => {
				expect(mockSearchPersonsByNameSearch).toHaveBeenCalledTimes(2);
				expect(mockSearchPersonsByNameSearch).toHaveBeenLastCalledWith(
					'someSearchTerm',
					startValueForTest,
					rowsValueForTest
				);
			});

			startValueForTest = 555;
			rowsValueForTest = 888;

			userEvent.click(callUpdateButton);

			await waitFor(() => {
				expect(mockSearchPersonsByNameSearch).toHaveBeenCalledTimes(3);
				expect(mockSearchPersonsByNameSearch).toHaveBeenLastCalledWith(
					'someSearchTerm',
					startValueForTest,
					rowsValueForTest
				);
			});
		});
	});
});

async function assertSearchIsCalledTimesWithGivenSearchTermAndDefaultStartRows(
	times: number,
	searchTerm: string
) {
	return waitFor(() => {
		expect(mockSearchPersonsByNameSearch).toHaveBeenCalledTimes(times);
		expect(mockSearchPersonsByNameSearch).toHaveBeenLastCalledWith(
			searchTerm,
			1,
			100
		);
	});
}

function createListWithPersons(persons: Person[]) {
	const toNumber = persons.length;
	return new List(persons, 1, toNumber, toNumber * 2);
}

function simulateSearchComponentTextInput(text: string) {
	stringToSendToOnValueChange = text;
	const onValueChangeButton = screen.getByRole('button', {
		name: 'callOnValueChange',
	});
	userEvent.click(onValueChangeButton);
}

function simulateSearchComponentSubmit() {
	const submitButton = screen.getByRole('button', { name: 'callOnSubmit' });
	userEvent.click(submitButton);
}
