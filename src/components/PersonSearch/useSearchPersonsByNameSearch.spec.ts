import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { renderHook, act } from '@testing-library/react-hooks/dom';
import { threePersonObjects } from '../../../testData/personData';
import { searchPersonsByNameSearch } from '../../control/api';
import List from '../../control/List';
import Person from '../../control/Person';
import useApi from '../../hooks/useApi';
import useSearchPersonsByNameSearch from './useSearchPersonsByNameSearch';

jest.mock('../../hooks/useApi');
const mockUseApi = useApi as jest.MockedFunction<typeof useApi>;
const mockSetApiParams = jest.fn();

type ReturnFromMockUseApi = {
	isLoading: boolean;
	result: {
		hasData: boolean;
		isError: boolean;
		data?: List;
		error?: Error;
	};
	setApiParams: React.Dispatch<any>;
};

const defaultReturnFromMockUseApi: ReturnFromMockUseApi = {
	isLoading: false,
	result: {
		hasData: true,
		isError: false,
		data: createListWithPersons(threePersonObjects),
		error: undefined,
	},
	setApiParams: mockSetApiParams,
};

beforeAll(() => {
	mockUseApi.mockReturnValue(defaultReturnFromMockUseApi);
});

describe('the useSearchPersonsByNameSearch hook', () => {
	it('takes searchTerm as well as initial start/rows as argument', () => {
		renderHook(() => useSearchPersonsByNameSearch('', 1, 10));
	});

	it('returns (amongst others) paginationVars, setPaginationVars', () => {
		const { result } = renderHook(() => useSearchPersonsByNameSearch(''));

		expect(result.current.paginationVars).toStrictEqual({ start: 1, rows: 10 });
		expect(result.current.setPaginationVars).toBeDefined();
	});

	describe('setPaginationVars sets the paginationVars', () => {
		it('if start >=1 and rows >= 1, as is', () => {
			const { result } = renderHook(() => useSearchPersonsByNameSearch(''));

			act(() => {
				result.current.setPaginationVars(2, 1);
			});

			expect(result.current.paginationVars).toStrictEqual({
				start: 2,
				rows: 1,
			});

			act(() => {
				result.current.setPaginationVars(5234, 1000);
			});

			expect(result.current.paginationVars).toStrictEqual({
				start: 5234,
				rows: 1000,
			});
		});

		it('if start < 1 and rows < 1, it sets them to 1', () => {
			const { result } = renderHook(() => useSearchPersonsByNameSearch(''));

			act(() => {
				result.current.setPaginationVars(-1, 0);
			});

			expect(result.current.paginationVars).toStrictEqual({
				start: 1,
				rows: 1,
			});

			act(() => {
				result.current.setPaginationVars(3, -1000);
			});

			expect(result.current.paginationVars).toStrictEqual({
				start: 3,
				rows: 1,
			});
		});

		it('if rows >1000, sets it to 1000', () => {
			const { result } = renderHook(() => useSearchPersonsByNameSearch(''));

			act(() => {
				result.current.setPaginationVars(234234234, 1001);
			});

			expect(result.current.paginationVars).toStrictEqual({
				start: 234234234,
				rows: 1000,
			});

			act(() => {
				result.current.setPaginationVars(-1, 23423423);
			});

			expect(result.current.paginationVars).toStrictEqual({
				start: 1,
				rows: 1000,
			});

			act(() => {
				result.current.setPaginationVars(1000, 1000);
			});

			expect(result.current.paginationVars).toStrictEqual({
				start: 1000,
				rows: 1000,
			});
		});

		it("if provided start/rows are unchanged, don't update state", () => {
			const { result } = renderHook(() => useSearchPersonsByNameSearch(''));

			result.current.setPaginationVars(1, 10);

			expect(result.current.paginationVars).toStrictEqual({
				start: 1,
				rows: 10,
			});
		});
	});

	describe('uses useApi', () => {
		it('calls useApi with searchPersonByNameSearch and empty params', () => {
			renderHook(() => useSearchPersonsByNameSearch(''));

			expect(mockUseApi).toHaveBeenLastCalledWith(
				searchPersonsByNameSearch,
				{}
			);
		});

		it('passes on isLoading from useApi', () => {
			defaultReturnFromMockUseApi.isLoading = false;

			const { result } = renderHook(() => useSearchPersonsByNameSearch(''));

			expect(result.current.isLoading).toBe(false);

			defaultReturnFromMockUseApi.isLoading = true;
			mockUseApi.mockReturnValueOnce(defaultReturnFromMockUseApi);

			act(() => {
				result.current.setPaginationVars(1, 25);
			});

			expect(result.current.isLoading).toBe(true);
		});

		it('passes on result from useApi', () => {
			const { result } = renderHook(() => useSearchPersonsByNameSearch(''));

			expect(result.current.result).toStrictEqual(
				defaultReturnFromMockUseApi.result
			);

			defaultReturnFromMockUseApi.result = {
				hasData: false,
				isError: true,
				error: new Error('someError'),
			};

			mockUseApi.mockReturnValueOnce(defaultReturnFromMockUseApi);

			act(() => {
				result.current.setPaginationVars(1, 25);
			});

			expect(result.current.result).toStrictEqual(
				defaultReturnFromMockUseApi.result
			);
		});

		it('if triggerSearch is called, does call setApiParams with start, rows and searchTerm', () => {
			const { result, rerender } = renderHook(
				(searchTerm) => useSearchPersonsByNameSearch(searchTerm),
				{ initialProps: 'someSearchTerm' }
			);

			expect(mockSetApiParams).toHaveBeenCalledTimes(1);
			expect(mockSetApiParams).toHaveBeenLastCalledWith({
				searchTerm: 'someSearchTerm',
				start: 1,
				rows: 10,
			});

			rerender('someOtherSearchTerm');

			expect(mockSetApiParams).toHaveBeenCalledTimes(1);

			act(() => {
				result.current.triggerSearch();
			});

			expect(mockSetApiParams).toHaveBeenCalledTimes(2);
			expect(mockSetApiParams).toHaveBeenLastCalledWith({
				searchTerm: 'someOtherSearchTerm',
				start: 1,
				rows: 10,
			});
		});

		it('hook is rendered with empty searchTerm, and triggerSearch is called, does not call setApiParams', () => {
			const { result, rerender } = renderHook(
				(searchTerm) => useSearchPersonsByNameSearch(searchTerm),
				{ initialProps: '' }
			);

			expect(mockSetApiParams).not.toHaveBeenCalled();

			rerender('someSearchTerm');

			act(() => {
				result.current.triggerSearch();
			});

			expect(mockSetApiParams).toHaveBeenCalledTimes(1);
			expect(mockSetApiParams).toHaveBeenLastCalledWith({
				searchTerm: 'someSearchTerm',
				start: 1,
				rows: 10,
			});

			rerender('');

			act(() => {
				result.current.triggerSearch();
			});
			expect(mockSetApiParams).toHaveBeenCalledTimes(1);
		});

		it('if hook is called with searchTerm and initial start/rows, and triggerSearch is called, does call setApiParams with start, rows and searchTerm', () => {
			const { result, rerender } = renderHook(
				({ searchTerm, initialStart, initialRows }) =>
					useSearchPersonsByNameSearch(searchTerm, initialStart, initialRows),
				{
					initialProps: {
						searchTerm: 'someSearchTerm',
						initialStart: 10,
						initialRows: 50,
					},
				}
			);

			expect(mockSetApiParams).toHaveBeenCalledTimes(1);
			expect(mockSetApiParams).toHaveBeenLastCalledWith({
				searchTerm: 'someSearchTerm',
				start: 10,
				rows: 50,
			});

			rerender({
				searchTerm: 'someOtherSearchTerm',
				initialStart: -1,
				initialRows: 1001,
			});

			act(() => {
				result.current.triggerSearch();
			});

			expect(mockSetApiParams).toHaveBeenCalledTimes(2);
			expect(mockSetApiParams).toHaveBeenLastCalledWith({
				searchTerm: 'someOtherSearchTerm',
				start: 10,
				rows: 50,
			});
		});

		it('if setPaginationVars is called with new vars, setApiParams is called with new start/row values', () => {
			const { result } = renderHook(() =>
				useSearchPersonsByNameSearch('someSearchTerm')
			);

			act(() => {
				result.current.setPaginationVars(2, 20);
			});

			expect(mockSetApiParams).toHaveBeenCalledTimes(2);
			expect(mockSetApiParams).toHaveBeenLastCalledWith({
				searchTerm: 'someSearchTerm',
				start: 2,
				rows: 20,
			});

			act(() => {
				result.current.setPaginationVars(333, 1000);
			});

			expect(mockSetApiParams).toHaveBeenCalledTimes(3);
			expect(mockSetApiParams).toHaveBeenLastCalledWith({
				searchTerm: 'someSearchTerm',
				start: 333,
				rows: 1000,
			});
		});

		it('if setPaginationVars is called with same vars, do not call setApiParams', () => {
			const { result } = renderHook(() =>
				useSearchPersonsByNameSearch('someSearchTerm')
			);

			act(() => {
				result.current.setPaginationVars(1, 10);
			});

			expect(mockSetApiParams).toHaveBeenCalledTimes(1);
		});
	});
});

function createListWithPersons(persons: Person[]) {
	const toNumber = persons.length;
	return new List(persons, 1, toNumber, toNumber * 2);
}
