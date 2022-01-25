import React from 'react';
import { act } from 'react-dom/test-utils';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import PersonSearch from '.';
import Person from '../../control/Person';
import List from '../../control/List';
import {
	personWithDomain,
	threePersonObjects,
} from '../../../testData/personData';
import useSearchPersonsByNameSearch from './useSearchPersonsByNameSearch';
import { renderWithRouter } from '../../../test-utils';
import SearchComponent from '../SearchComponent';
import PaginatedCardList from '../PaginatedCardList';
import useRowsWithString from './useRowsWithString';
import useStartWithString from './useStartWithString';

jest.mock('./useSearchPersonsByNameSearch');
const mockSetPaginationVars = jest.fn();
const mockTriggerSearchWithParams = jest.fn();
const mockUseSearchPersonsByNameSearch =
	useSearchPersonsByNameSearch as jest.MockedFunction<
		typeof useSearchPersonsByNameSearch
	>;
const defaultListToReturn = createListWithPersons(threePersonObjects);

jest.mock('../SearchComponent');
const mockSearchComponent = SearchComponent as jest.MockedFunction<
	typeof SearchComponent
>;
let receivedOnSubmit: () => void;
let receivedOnValueChange: (val: string) => void;
let receivedValue: string;

jest.mock('../PaginatedCardList');
const mockPaginatedCardList = PaginatedCardList as jest.MockedFunction<
	typeof PaginatedCardList
>;
let receivedOnPaginationUpdate: (start: number, rows: number) => void;

jest.mock('./useRowsWithString');
const mockUseRowsWithString = useRowsWithString as jest.MockedFunction<
	typeof useRowsWithString
>;
let returnedByUseRowsWithString = { rows: 10 };

// jest.mock('./useStart');
// const mockUseStart = useStart as jest.MockedFunction<typeof useStart>;

jest.mock('./useStartWithString');
const mockUseStartWithString = useStartWithString as jest.MockedFunction<
	typeof useStartWithString
>;

beforeAll(() => {
	mockUseSearchPersonsByNameSearch.mockReturnValue({
		isLoading: false,
		result: {
			hasData: true,
			isError: false,
			data: defaultListToReturn,
		},
		triggerSearchWithParams: mockTriggerSearchWithParams,
	});

	type Props = {
		value: string;
		onSubmit: () => void;
		onValueChange: (val: string) => void;
	};

	mockSearchComponent.mockImplementation((props: Props) => {
		receivedOnSubmit = props.onSubmit;
		receivedOnValueChange = props.onValueChange;
		receivedValue = props.value;
		return <div />;
	});

	type PaginatedCardListProps = {
		list: List;
		onPaginationUpdate(start: number, rows: number): void;
		rows: number;
	};

	mockPaginatedCardList.mockImplementation((props: PaginatedCardListProps) => {
		receivedOnPaginationUpdate = props.onPaginationUpdate;
		return <div />;
	});

	// mockUseRowsWithString.mockImplementation(
	// 	(rows: string, maxRows: number, defaultRows: number) => {
	// 		return { rows: parseInt(rows, 10) };
	// 	}
	// );

	mockUseRowsWithString.mockReturnValue(returnedByUseRowsWithString);
	mockUseStartWithString.mockReturnValue({ start: 1 });
});

describe('The PersonSearch component', () => {
	describe('Uses useRowsWithString', () => {
		it('if searchParams contain rows, pass it to useRowsWithString', () => {
			render(
				<MemoryRouter initialEntries={['?rows=10']}>
					<PersonSearch />
				</MemoryRouter>
			);

			expect(mockUseRowsWithString).toHaveBeenCalledTimes(1);
			expect(mockUseRowsWithString).toHaveBeenLastCalledWith('10', 100, 10);

			render(
				<MemoryRouter initialEntries={['?rows=50']}>
					<PersonSearch />
				</MemoryRouter>
			);

			expect(mockUseRowsWithString).toHaveBeenCalledTimes(2);
			expect(mockUseRowsWithString).toHaveBeenLastCalledWith('50', 100, 10);
		});

		it('if searchParams does not contain rows, pass empty string to useRowsWithString', () => {
			render(
				<MemoryRouter initialEntries={['?rows=']}>
					<PersonSearch />
				</MemoryRouter>
			);

			expect(mockUseRowsWithString).toHaveBeenCalledTimes(1);
			expect(mockUseRowsWithString).toHaveBeenLastCalledWith('', 100, 10);
		});
	});

	describe('Uses useStartWithString', () => {
		it('if searchParams contain start, pass it to useStartWithString', () => {
			render(
				<MemoryRouter initialEntries={['?start=50']}>
					<PersonSearch />
				</MemoryRouter>
			);

			expect(mockUseStartWithString).toHaveBeenCalledTimes(1);
			expect(mockUseStartWithString).toHaveBeenCalledWith('50');

			render(
				<MemoryRouter initialEntries={['?start=20']}>
					<PersonSearch />
				</MemoryRouter>
			);

			expect(mockUseStartWithString).toHaveBeenCalledTimes(2);
			expect(mockUseStartWithString).toHaveBeenCalledWith('20');
		});

		it("if searchParams does not contain start, pass '1' to useStartWithString", () => {
			render(
				<MemoryRouter initialEntries={['?start=']}>
					<PersonSearch />
				</MemoryRouter>
			);

			expect(mockUseStartWithString).toHaveBeenCalledTimes(1);
			expect(mockUseStartWithString).toHaveBeenCalledWith('1');
		});
	});

	describe('Uses useSearchPersonsByNameSearch', () => {
		it('should call useSearchPersonsByNameSearch, initially with an empty searchTerm and start from useStartWithString and rows from useRowsWithString', () => {
			mockUseRowsWithString.mockReturnValueOnce({ rows: 50 });
			mockUseStartWithString.mockReturnValueOnce({ start: 20 });

			renderWithRouter(<PersonSearch />);

			expect(mockUseSearchPersonsByNameSearch).toHaveBeenCalledTimes(1);
			expect(mockUseSearchPersonsByNameSearch).toHaveBeenLastCalledWith(
				'',
				20,
				50
			);
		});

		describe('with useSearchParams', () => {
			it('if searchParams contain searchTerm, pass it to useSearchPersonsByNameSearch', () => {
				render(
					<MemoryRouter initialEntries={['?searchTerm=someSearchTerm']}>
						<PersonSearch />
					</MemoryRouter>
				);

				expect(mockUseSearchPersonsByNameSearch).toHaveBeenCalledTimes(1);
				expect(mockUseSearchPersonsByNameSearch).toHaveBeenLastCalledWith(
					'someSearchTerm',
					1,
					10
				);
			});

			it('if searchParams contain empty searchTerm, pass "" to useSearchPersonsByNameSearch', () => {
				render(
					<MemoryRouter initialEntries={['?searchTerm=']}>
						<PersonSearch />
					</MemoryRouter>
				);

				expect(mockUseSearchPersonsByNameSearch).toHaveBeenCalledTimes(1);
				expect(mockUseSearchPersonsByNameSearch).toHaveBeenLastCalledWith(
					'',
					1,
					10
				);
			});

			// it("if searchParams contain start, pass it to useSearchPersonsByNameSearch, if it doesn't, pass 1", () => {
			// 	render(
			// 		<MemoryRouter initialEntries={['?start=2']}>
			// 			<PersonSearch />
			// 		</MemoryRouter>
			// 	);

			// 	expect(mockUseSearchPersonsByNameSearch).toHaveBeenCalledTimes(1);
			// 	expect(mockUseSearchPersonsByNameSearch).toHaveBeenLastCalledWith(
			// 		'',
			// 		2,
			// 		10
			// 	);

			// 	render(
			// 		<MemoryRouter initialEntries={['?start']}>
			// 			<PersonSearch />
			// 		</MemoryRouter>
			// 	);

			// 	expect(mockUseSearchPersonsByNameSearch).toHaveBeenCalledTimes(2);
			// 	expect(mockUseSearchPersonsByNameSearch).toHaveBeenLastCalledWith(
			// 		'',
			// 		1,
			// 		10
			// 	);
			// });

			// it("if searchParams contain rows, pass it to useSearchPersonsByNameSearch, if it doesn't, pass 10", () => {
			// 	render(
			// 		<MemoryRouter initialEntries={['?rows=50']}>
			// 			<PersonSearch />
			// 		</MemoryRouter>
			// 	);

			// 	expect(mockUseSearchPersonsByNameSearch).toHaveBeenCalledTimes(1);
			// 	expect(mockUseSearchPersonsByNameSearch).toHaveBeenLastCalledWith(
			// 		'',
			// 		1,
			// 		50
			// 	);

			// 	render(
			// 		<MemoryRouter initialEntries={['?rows']}>
			// 			<PersonSearch />
			// 		</MemoryRouter>
			// 	);

			// 	expect(mockUseSearchPersonsByNameSearch).toHaveBeenCalledTimes(2);
			// 	expect(mockUseSearchPersonsByNameSearch).toHaveBeenLastCalledWith(
			// 		'',
			// 		1,
			// 		10
			// 	);
			// });
		});
	});

	describe('Uses SearchComponent', () => {
		describe('with useSearchParams', () => {
			it('passes default rowOptions to SearchComponent', () => {
				renderWithRouter(<PersonSearch />);
				expect(mockSearchComponent).toHaveBeenLastCalledWith(
					expect.objectContaining({
						rowOptions: [10, 25, 50, 100],
					}),
					expect.any(Object)
				);
			});

			it.todo('handle onRowUpdate');
			it.todo('send in rows');

			it('passes searchTerm from useSearchParams as value', () => {
				render(
					<MemoryRouter initialEntries={['?searchTerm=someNiceSearchTerm']}>
						<PersonSearch />
					</MemoryRouter>
				);

				expect(mockSearchComponent).toHaveBeenLastCalledWith(
					expect.objectContaining({
						value: 'someNiceSearchTerm',
					}),
					expect.any(Object)
				);
			});

			it('if onValueChange is called, searchParams get updated', () => {
				render(
					<MemoryRouter initialEntries={['?searchTerm=someNiceSearchTerm']}>
						<PersonSearch />
					</MemoryRouter>
				);

				act(() => {
					receivedOnValueChange('someNewValue');
				});

				expect(receivedValue).toStrictEqual('someNewValue');
			});

			it('if onValueChange is called, useSearchPersonsByNameSearch is called again', () => {
				render(
					<MemoryRouter initialEntries={['?searchTerm=someNiceSearchTerm']}>
						<PersonSearch />
					</MemoryRouter>
				);

				act(() => {
					receivedOnValueChange('someNewValue');
				});

				expect(receivedValue).toStrictEqual('someNewValue');

				expect(mockUseSearchPersonsByNameSearch).toHaveBeenCalledTimes(2);
				expect(mockUseSearchPersonsByNameSearch).toHaveBeenLastCalledWith(
					'someNewValue',
					1,
					10
				);
			});

			it.only('if onSubmit is called, useSearchPersonsByNameSearches triggerSearch is called with the searchTerm', () => {
				render(
					<MemoryRouter initialEntries={['?searchTerm=someNiceSearchTerm']}>
						<PersonSearch />
					</MemoryRouter>
				);

				act(() => {
					receivedOnSubmit();
				});

				expect(mockTriggerSearchWithParams).toHaveBeenCalledTimes(1);
				expect(true).toBe(false);
			});
		});
	});

	describe('Uses PaginatedCardList', () => {
		it('does not call PaginatedCardList, if useSearchPersonsByNameSearch does not return data', () => {
			mockUseSearchPersonsByNameSearch.mockReturnValueOnce({
				isLoading: false,
				result: {
					hasData: false,
					isError: false,
				},
				triggerSearchWithParams: mockTriggerSearchWithParams,
			});

			renderWithRouter(<PersonSearch />);

			expect(mockPaginatedCardList).not.toHaveBeenCalled();
		});

		it('does call PaginatedCardList with list, rows and onPaginationUpdate if useSearchPersonsByNameSearch does return data', () => {
			mockUseSearchPersonsByNameSearch.mockReturnValueOnce({
				isLoading: false,
				result: {
					hasData: true,
					isError: false,
					data: defaultListToReturn,
				},
				triggerSearchWithParams: mockTriggerSearchWithParams,
			});

			renderWithRouter(<PersonSearch />);

			expect(mockPaginatedCardList).toHaveBeenCalledTimes(1);

			expect(mockPaginatedCardList).toHaveBeenLastCalledWith(
				expect.objectContaining({
					list: defaultListToReturn,
					rows: returnedByUseRowsWithString.rows,
				}),
				expect.any(Object)
			);

			returnedByUseRowsWithString = { rows: 20 };
			mockUseRowsWithString.mockReturnValueOnce(returnedByUseRowsWithString);

			const someOtherList = createListWithPersons([personWithDomain]);
			mockUseSearchPersonsByNameSearch.mockReturnValueOnce({
				isLoading: false,
				result: {
					hasData: true,
					isError: false,
					data: someOtherList,
				},
				triggerSearchWithParams: mockTriggerSearchWithParams,
			});

			renderWithRouter(<PersonSearch />);

			expect(mockPaginatedCardList).toHaveBeenCalledTimes(2);
			expect(mockPaginatedCardList).toHaveBeenLastCalledWith(
				expect.objectContaining({
					list: someOtherList,
					rows: returnedByUseRowsWithString.rows,
				}),
				expect.any(Object)
			);
		});

		it('onPaginationUpdate passed to PaginatedCardList calls useSearchPersonsByNameSearches setPaginationVars and NOT triggerSearch', () => {
			renderWithRouter(<PersonSearch />);

			act(() => {
				receivedOnPaginationUpdate(333, 40);
			});
			expect(mockSetPaginationVars).toHaveBeenCalledTimes(1);
			expect(mockSetPaginationVars).toHaveBeenLastCalledWith(333, 40);
			expect(mockTriggerSearchWithParams).toHaveBeenCalledTimes(0);

			act(() => {
				receivedOnPaginationUpdate(20, 30);
			});
			expect(mockSetPaginationVars).toHaveBeenCalledTimes(2);
			expect(mockSetPaginationVars).toHaveBeenLastCalledWith(20, 30);
			expect(mockTriggerSearchWithParams).toHaveBeenCalledTimes(0);
		});
	});

	describe('It has a loading state', () => {
		it('while useSearchPersonsByNameSearch is loading, an explanatory text is shown', () => {
			mockUseSearchPersonsByNameSearch.mockReturnValueOnce({
				isLoading: true,
				result: {
					hasData: false,
					isError: false,
				},
				triggerSearchWithParams: mockTriggerSearchWithParams,
			});

			renderWithRouter(<PersonSearch />);

			expect(mockPaginatedCardList).toHaveBeenCalledTimes(0);
			expect(screen.queryByText(/Laddar.../i)).toBeInTheDocument();
		});

		it('if useSearchPersonsByNameSearch is not loading, the text is not shown', () => {
			mockUseSearchPersonsByNameSearch.mockReturnValueOnce({
				isLoading: false,
				result: {
					hasData: false,
					isError: false,
				},
				triggerSearchWithParams: mockTriggerSearchWithParams,
			});

			renderWithRouter(<PersonSearch />);

			expect(mockPaginatedCardList).toHaveBeenCalledTimes(0);
			expect(screen.queryByText(/Laddar.../i)).not.toBeInTheDocument();
		});
	});

	describe('It displays an error if there is an error returned by useSearchPersonsByNameSearch', () => {
		it('It displays an error if there is an error returned by useSearchPersonsByNameSearch', () => {
			mockUseSearchPersonsByNameSearch.mockReturnValueOnce({
				isLoading: false,
				result: {
					hasData: false,
					isError: true,
					error: new Error(
						'Some Error message returned by useSearchPersonsByNameSearch'
					),
				},
				triggerSearchWithParams: mockTriggerSearchWithParams,
			});

			const { rerender } = renderWithRouter(<PersonSearch />);

			expect(
				screen.queryByText(
					'Ett fel har inträffat: "Some Error message returned by useSearchPersonsByNameSearch"'
				)
			).toBeInTheDocument();

			mockUseSearchPersonsByNameSearch.mockReturnValueOnce({
				isLoading: false,
				result: {
					hasData: false,
					isError: true,
					error: new Error(
						'Some other Error message returned by useSearchPersonsByNameSearch'
					),
				},
				triggerSearchWithParams: mockTriggerSearchWithParams,
			});

			rerender(<PersonSearch />);
			expect(
				screen.queryByText(
					'Ett fel har inträffat: "Some other Error message returned by useSearchPersonsByNameSearch"'
				)
			).toBeInTheDocument();
		});

		it('does not display an error if there is no error', () => {
			mockUseSearchPersonsByNameSearch.mockReturnValueOnce({
				isLoading: false,
				result: {
					hasData: false,
					isError: false,
				},
				triggerSearchWithParams: mockTriggerSearchWithParams,
			});

			renderWithRouter(<PersonSearch />);

			expect(
				screen.queryByText('Ett fel har inträffat: ""')
			).not.toBeInTheDocument();
		});
	});

	it.todo(
		'Think about what to do if rows are changed from within SearchComponent. It should be reflected in the searchParams.'
	);
	it.todo(
		'Ideally the logic on which rows should be allowed, should be in a hook'
	);
});

function createListWithPersons(persons: Person[]) {
	const toNumber = persons.length;
	return new List(persons, 1, toNumber, toNumber * 2);
}
