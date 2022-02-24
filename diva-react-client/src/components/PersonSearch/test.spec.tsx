import React from 'react';
import { act } from 'react-dom/test-utils';
import { screen } from '@testing-library/react';
import PersonSearch from '.';
import {
	createListWithPersons,
	personWithDomain,
	threePersonObjects,
} from '../../../testData/personObjectData';
import useSearchPersonsByNameSearch from './useSearchPersonsByNameSearch';
import { renderWithRouter } from '../../../test-utils';
import SearchComponent from '../SearchComponent';
import PaginatedCardList from '../PaginatedCardList';
import usePersonSearchParams from './usePersonSearchParams';
import {List} from 'diva-cora-ts-api-wrapper';

jest.mock('./useSearchPersonsByNameSearch');
const mockedTriggerSearchWithParams = jest.fn();
const mockUseSearchPersonsByNameSearch =
	useSearchPersonsByNameSearch as jest.MockedFunction<
		typeof useSearchPersonsByNameSearch
	>;
const defaultListToReturn = createListWithPersons(threePersonObjects);

jest.mock('../SearchComponent');
const mockSearchComponent = SearchComponent as jest.MockedFunction<
	typeof SearchComponent
>;
let searchComponentReceivedOnSubmit: () => void;
let searchComponentReceivedOnValueChange: (val: string) => void;
let searchComponentReceivedOnRowUpdate: (val: number) => void;

jest.mock('../PaginatedCardList');
const mockPaginatedCardList = PaginatedCardList as jest.MockedFunction<
	typeof PaginatedCardList
>;
let receivedOnPaginationUpdate: (start: number) => void;

jest.mock('./usePersonSearchParams');
const mockedUsePersonSearchParams =
	usePersonSearchParams as jest.MockedFunction<typeof usePersonSearchParams>;
const mockedSetSearchTerm = jest.fn();
const mockedSetStart = jest.fn();
const mockedSetRows = jest.fn();

beforeAll(() => {
	mockUseSearchPersonsByNameSearch.mockReturnValue({
		isLoading: false,
		result: {
			hasData: true,
			isError: false,
			data: defaultListToReturn,
		},
		triggerSearchWithParams: mockedTriggerSearchWithParams,
	});

	type Props = {
		value: string;
		onSubmit: () => void;
		onValueChange: (val: string) => void;
		onRowUpdate: (val: number) => void;
	};

	mockSearchComponent.mockImplementation((props: Props) => {
		searchComponentReceivedOnSubmit = props.onSubmit;
		searchComponentReceivedOnValueChange = props.onValueChange;
		searchComponentReceivedOnRowUpdate = props.onRowUpdate;
		return <div />;
	});

	type PaginatedCardListProps = {
		list: List;
		onPaginationUpdate(start: number): void;
		rows: number;
	};

	mockPaginatedCardList.mockImplementation((props: PaginatedCardListProps) => {
		receivedOnPaginationUpdate = props.onPaginationUpdate;
		return <div />;
	});

	mockReturnFromUsePersonSearchParams('someDefaultSearchTerm', 99999, 999999);
});

describe('The PersonSearch component', () => {
	it('displays heading "Personsök"', () => {
		renderWithRouter(<PersonSearch />);

		expect(
			screen.getByRole('heading', { name: 'Personsök' })
		).toBeInTheDocument();
	});

	describe('Uses usePersonSearchParams', () => {
		it('calls usePersonSearchParams', () => {
			renderWithRouter(<PersonSearch />);

			expect(mockedUsePersonSearchParams).toHaveBeenCalledTimes(1);
		});
	});

	describe('Uses useSearchPersonsByNameSearch', () => {
		it('should call useSearchPersonsByNameSearch, with searchTerm/start/rows from usePersonSearchParams', () => {
			mockReturnFromUsePersonSearchParams('someCoolTerm', 1, 10);
			renderWithRouter(<PersonSearch />);

			expect(mockUseSearchPersonsByNameSearch).toHaveBeenCalledTimes(1);
			expect(mockUseSearchPersonsByNameSearch).toHaveBeenLastCalledWith(
				'someCoolTerm',
				1,
				10
			);

			mockReturnFromUsePersonSearchParams('someSearchTerm', 30, 100);

			renderWithRouter(<PersonSearch />);

			expect(mockUseSearchPersonsByNameSearch).toHaveBeenCalledTimes(2);
			expect(mockUseSearchPersonsByNameSearch).toHaveBeenLastCalledWith(
				'someSearchTerm',
				30,
				100
			);
		});
	});

	describe('Uses SearchComponent', () => {
		describe('with usePersonSearchParams', () => {
			it('passes default rowOptions to SearchComponent', () => {
				renderWithRouter(<PersonSearch />);
				expect(mockSearchComponent).toHaveBeenLastCalledWith(
					expect.objectContaining({
						rowOptions: [10, 25, 50, 100],
					}),
					expect.any(Object)
				);
			});

			it('passes searchTerm and rows from useSearchParams as value', () => {
				mockReturnFromUsePersonSearchParams('someAwesomeSearchTerm', 1, 1234);
				renderWithRouter(<PersonSearch />);

				expect(mockSearchComponent).toHaveBeenLastCalledWith(
					expect.objectContaining({
						value: 'someAwesomeSearchTerm',
						rows: 1234,
					}),
					expect.any(Object)
				);

				mockReturnFromUsePersonSearchParams('someOtherSearchTerm', 1, 444);

				renderWithRouter(<PersonSearch />);

				expect(mockSearchComponent).toHaveBeenLastCalledWith(
					expect.objectContaining({
						value: 'someOtherSearchTerm',
						rows: 444,
					}),
					expect.any(Object)
				);
			});

			it("if onRowUpdate is called, usePersonSearchParam's setRows is called", () => {
				renderWithRouter(<PersonSearch />);

				act(() => {
					searchComponentReceivedOnRowUpdate(123415);
				});

				expect(mockedSetRows).toHaveBeenLastCalledWith(123415);

				act(() => {
					searchComponentReceivedOnRowUpdate(434345);
				});

				expect(mockedSetRows).toHaveBeenLastCalledWith(434345);
			});

			it('if onRowUpdate is called, useSearchPersonsByNameSearches triggerSearchWithParams is called with the new rows', () => {
				mockReturnFromUsePersonSearchParams('awesomeTerm', 1, 10);
				renderWithRouter(<PersonSearch />);

				act(() => {
					searchComponentReceivedOnRowUpdate(30);
				});

				expect(mockedTriggerSearchWithParams).toHaveBeenLastCalledWith(
					'awesomeTerm',
					1,
					30
				);

				act(() => {
					searchComponentReceivedOnRowUpdate(434345);
				});

				expect(mockedTriggerSearchWithParams).toHaveBeenLastCalledWith(
					'awesomeTerm',
					1,
					434345
				);

				mockReturnFromUsePersonSearchParams('coolTerm', 30, 500);
				renderWithRouter(<PersonSearch />);

				act(() => {
					searchComponentReceivedOnRowUpdate(85775);
				});

				expect(mockedTriggerSearchWithParams).toHaveBeenLastCalledWith(
					'coolTerm',
					30,
					85775
				);
			});

			it('if onValueChange is called, searchParams get updated', () => {
				renderWithRouter(<PersonSearch />);

				act(() => {
					searchComponentReceivedOnValueChange('someNewValue');
				});

				expect(mockedSetSearchTerm).toHaveBeenCalledWith('someNewValue');
			});

			it('if onSubmit is called, useSearchPersonsByNameSearches triggerSearchWithParams is called with the searchTerm, start and rows from usePersonSearchParams', () => {
				mockReturnFromUsePersonSearchParams('someFooSearchTerm', 2, 3);

				renderWithRouter(<PersonSearch />);

				act(() => {
					searchComponentReceivedOnSubmit();
				});

				expect(mockedTriggerSearchWithParams).toHaveBeenCalledTimes(1);
				expect(mockedTriggerSearchWithParams).toHaveBeenLastCalledWith(
					'someFooSearchTerm',
					2,
					3
				);

				mockReturnFromUsePersonSearchParams('someNewSearchTerm', 500, 1234);

				renderWithRouter(<PersonSearch />);

				act(() => {
					searchComponentReceivedOnSubmit();
				});

				expect(mockedTriggerSearchWithParams).toHaveBeenCalledTimes(2);
				expect(mockedTriggerSearchWithParams).toHaveBeenLastCalledWith(
					'someNewSearchTerm',
					500,
					1234
				);
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
				triggerSearchWithParams: mockedTriggerSearchWithParams,
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
				triggerSearchWithParams: mockedTriggerSearchWithParams,
			});
			mockReturnFromUsePersonSearchParams('someBarSearch', 4334, 84839);

			renderWithRouter(<PersonSearch />);

			expect(mockPaginatedCardList).toHaveBeenCalledTimes(1);

			expect(mockPaginatedCardList).toHaveBeenLastCalledWith(
				expect.objectContaining({
					list: defaultListToReturn,
					rows: 84839,
				}),
				expect.any(Object)
			);

			mockReturnFromUsePersonSearchParams('someFooSearch', 434, 5445);

			const someOtherList = createListWithPersons([personWithDomain]);
			mockUseSearchPersonsByNameSearch.mockReturnValueOnce({
				isLoading: false,
				result: {
					hasData: true,
					isError: false,
					data: someOtherList,
				},
				triggerSearchWithParams: mockedTriggerSearchWithParams,
			});

			renderWithRouter(<PersonSearch />);

			expect(mockPaginatedCardList).toHaveBeenCalledTimes(2);
			expect(mockPaginatedCardList).toHaveBeenLastCalledWith(
				expect.objectContaining({
					list: someOtherList,
					rows: 5445,
				}),
				expect.any(Object)
			);
		});

		it('onPaginationUpdate passed to PaginatedCardList calls useSearchPersonsByNameSearches triggerSearchWithParams with start from onPaginationUpdate an rows from usePersonSearchParams', () => {
			mockReturnFromUsePersonSearchParams('someSearch', 1, 40);
			renderWithRouter(<PersonSearch />);

			act(() => {
				receivedOnPaginationUpdate(333);
			});
			expect(mockedTriggerSearchWithParams).toHaveBeenCalledTimes(1);
			expect(mockedTriggerSearchWithParams).toHaveBeenLastCalledWith(
				'someSearch',
				333,
				40
			);

			act(() => {
				receivedOnPaginationUpdate(20);
			});
			expect(mockedTriggerSearchWithParams).toHaveBeenCalledTimes(2);
			expect(mockedTriggerSearchWithParams).toHaveBeenLastCalledWith(
				'someSearch',
				20,
				40
			);

			mockReturnFromUsePersonSearchParams('someOtherSearch', 342, 3333);

			renderWithRouter(<PersonSearch />);

			act(() => {
				receivedOnPaginationUpdate(500);
			});

			expect(mockedTriggerSearchWithParams).toHaveBeenCalledTimes(3);
			expect(mockedTriggerSearchWithParams).toHaveBeenLastCalledWith(
				'someOtherSearch',
				500,
				3333
			);
		});

		it('onPaginationUpdate passed to PaginatedCardList calls usePersonSearches setStart with received start value', () => {
			mockReturnFromUsePersonSearchParams('someSearch', 1, 40);
			renderWithRouter(<PersonSearch />);

			act(() => {
				receivedOnPaginationUpdate(333);
			});
			expect(mockedSetStart).toHaveBeenCalledTimes(1);
			expect(mockedSetStart).toHaveBeenLastCalledWith(333);

			act(() => {
				receivedOnPaginationUpdate(20);
			});
			expect(mockedSetStart).toHaveBeenCalledTimes(2);
			expect(mockedSetStart).toHaveBeenLastCalledWith(20);
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
				triggerSearchWithParams: mockedTriggerSearchWithParams,
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
				triggerSearchWithParams: mockedTriggerSearchWithParams,
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
				triggerSearchWithParams: mockedTriggerSearchWithParams,
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
				triggerSearchWithParams: mockedTriggerSearchWithParams,
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
				triggerSearchWithParams: mockedTriggerSearchWithParams,
			});

			renderWithRouter(<PersonSearch />);

			expect(
				screen.queryByText('Ett fel har inträffat: ""')
			).not.toBeInTheDocument();
		});
	});
});

function mockReturnFromUsePersonSearchParams(
	searchTerm: string,
	start: number,
	rows: number
) {
	mockedUsePersonSearchParams.mockReturnValue({
		searchTerm,
		start,
		rows,
		setSearchTerm: mockedSetSearchTerm,
		setStart: mockedSetStart,
		setRows: mockedSetRows,
	});
}
