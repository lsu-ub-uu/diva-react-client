import React from 'react';
import { act } from 'react-dom/test-utils';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import PersonSearch from './PersonSearch';
import Person from '../../control/Person';
import List from '../../control/List';
import { threePersonObjects } from '../../../testData/personData';
import useSearchPersonsByNameSearch from './useSearchPersonsByNameSearch';
import { renderWithRouter } from '../../../test-utils';
import SearchComponent from '../SearchComponent';
import PaginationComponent from '../PaginationComponent';

jest.mock('./useSearchPersonsByNameSearch');
const mockSetPaginationVars = jest.fn();
const mockTriggerSearch = jest.fn();
const mockUseSearchPersonsByNameSearch =
	useSearchPersonsByNameSearch as jest.MockedFunction<
		typeof useSearchPersonsByNameSearch
	>;

let receivedOnSubmit: () => void;
let receivedOnValueChange: (val: string) => void;
let receivedValue: string;

jest.mock('../SearchComponent');

const mockSearchComponent = SearchComponent as jest.MockedFunction<
	typeof SearchComponent
>;

jest.mock('../PaginationComponent');
// const mockPaginationComponent = PaginationComponent as jest.MockedFunction<
// 	React.MemoExoticComponent<
// 		({
// 			start,
// 			rows,
// 			toNumber,
// 			totalNumber,
// 			onPaginationUpdate,
// 		}: {
// 			start: number;
// 			rows: number;
// 			toNumber: number;
// 			totalNumber: number;
// 			onPaginationUpdate(start: number, rows: number): void;
// 		}) => JSX.Element
// 	>
// >;

// const mockPaginationComponent = PaginationComponent as jest.MockedFunction<
// 	typeof PaginationComponent
// >;

beforeAll(() => {
	mockUseSearchPersonsByNameSearch.mockReturnValue({
		isLoading: false,
		result: {
			hasData: true,
			isError: false,
			data: createListWithPersons(threePersonObjects),
		},
		paginationVars: { start: 1, rows: 10 },
		setPaginationVars: mockSetPaginationVars,
		triggerSearch: mockTriggerSearch,
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

	type PaginationComponentProps = {
		start: number;
		rows: number;
		toNumber: number;
		totalNumber: number;
		onPaginationUpdate(start: number, rows: number): void;
	};

	// mockPaginationComponent.mockImplementation(
	// 	(props: PaginationComponentProps) => {
	// 		return <div />;
	// 	}
	// );
});

describe('The PersonSearch component', () => {
	describe('Uses useSearchPersonsByNameSearch', () => {
		it('should call useSearchPersonsByNameSearch, initially with an empty searchTerm and start/row 1/10', () => {
			renderWithRouter(<PersonSearch />);

			expect(mockUseSearchPersonsByNameSearch).toHaveBeenCalledTimes(1);
			expect(mockUseSearchPersonsByNameSearch).toHaveBeenLastCalledWith(
				'',
				1,
				10
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

			it("if searchParams contain start, pass it to useSearchPersonsByNameSearch, if it doesn't, pass 1", () => {
				render(
					<MemoryRouter initialEntries={['?start=2']}>
						<PersonSearch />
					</MemoryRouter>
				);

				expect(mockUseSearchPersonsByNameSearch).toHaveBeenCalledTimes(1);
				expect(mockUseSearchPersonsByNameSearch).toHaveBeenLastCalledWith(
					'',
					2,
					10
				);

				render(
					<MemoryRouter initialEntries={['?start']}>
						<PersonSearch />
					</MemoryRouter>
				);

				expect(mockUseSearchPersonsByNameSearch).toHaveBeenCalledTimes(2);
				expect(mockUseSearchPersonsByNameSearch).toHaveBeenLastCalledWith(
					'',
					1,
					10
				);
			});

			it("if searchParams contain rows, pass it to useSearchPersonsByNameSearch, if it doesn't, pass 10", () => {
				render(
					<MemoryRouter initialEntries={['?rows=50']}>
						<PersonSearch />
					</MemoryRouter>
				);

				expect(mockUseSearchPersonsByNameSearch).toHaveBeenCalledTimes(1);
				expect(mockUseSearchPersonsByNameSearch).toHaveBeenLastCalledWith(
					'',
					1,
					50
				);

				render(
					<MemoryRouter initialEntries={['?rows']}>
						<PersonSearch />
					</MemoryRouter>
				);

				expect(mockUseSearchPersonsByNameSearch).toHaveBeenCalledTimes(2);
				expect(mockUseSearchPersonsByNameSearch).toHaveBeenLastCalledWith(
					'',
					1,
					10
				);
			});
		});
	});

	describe('Uses SearchComponent', () => {
		describe('with useSearchParams', () => {
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

				expect(mockUseSearchPersonsByNameSearch).toHaveBeenCalledTimes(2);
			});

			it('if onSubmit is called, useSearchPersonsByNameSearches triggerSearch is called', () => {
				render(
					<MemoryRouter initialEntries={['?searchTerm=someNiceSearchTerm']}>
						<PersonSearch />
					</MemoryRouter>
				);

				act(() => {
					receivedOnSubmit();
				});

				expect(mockTriggerSearch).toHaveBeenCalledTimes(1);
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
				paginationVars: { start: 1, rows: 10 },
				setPaginationVars: mockSetPaginationVars,
				triggerSearch: mockTriggerSearch,
			});

			renderWithRouter(<PersonSearch />);

			// expect(mockPaginationComponent).not.toHaveBeenCalled();
			expect(mockPaginationComponent.mock.calls).toHaveLength(0);

			// expect(mockUseSearchPersonsByNameSearch).toHaveBeenCalledTimes(1);
			// expect(mockUseSearchPersonsByNameSearch).toHaveBeenLastCalledWith(
			// 	'',
			// 	1,
			// 	10
			// );
			// expect(PaginationComponent);
		});
	});
});

function createListWithPersons(persons: Person[]) {
	const toNumber = persons.length;
	return new List(persons, 1, toNumber, toNumber * 2);
}
