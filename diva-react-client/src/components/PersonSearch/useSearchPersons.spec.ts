import React from 'react';
import { renderHook } from '@testing-library/react-hooks/dom';
import { List, searchPersonsByGeneralSearch } from 'diva-cora-ts-api-wrapper';
import {
	createListWithPersons,
	threePersonObjects,
} from '../../../testData/personObjectData';
import useApi from '../../hooks/useApi';
import useSearchPersonsByGeneralSearch from './useSearchPersons';

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

describe('the useSearchPersonsByGeneralSearch hook', () => {
	it('takes searchTerm as well as start and rows as argument', () => {
		renderHook(() => useSearchPersonsByGeneralSearch('', 1, 10));
	});

	describe('uses useApi', () => {
		it('calls useApi with searchPersonByGeneralSearch and empty params, does NOT call setApiParams on first render if empty searchTerm', () => {
			renderHook(() => useSearchPersonsByGeneralSearch('', 1, 10));

			expect(mockUseApi).toHaveBeenLastCalledWith(
				searchPersonsByGeneralSearch,
				{}
			);

			expect(mockSetApiParams).not.toHaveBeenCalled();
		});

		it('calls useApi with searchPersonByGeneralSearch and empty params, does NOT call setApiParams on subsequent renders, even if searchTerm given', () => {
			const { rerender } = renderHook(
				({ searchTerm }) =>
					useSearchPersonsByGeneralSearch(searchTerm, 1, 10),
				{ initialProps: { searchTerm: '' } }
			);

			expect(mockUseApi).toHaveBeenLastCalledWith(
				searchPersonsByGeneralSearch,
				{}
			);

			expect(mockSetApiParams).not.toHaveBeenCalled();
			rerender({ searchTerm: 'someSearchTerm' });

			expect(mockSetApiParams).not.toHaveBeenCalled();
		});

		it('calls useApi with searchPersonByGeneralSearch and empty params, DOES call setApiParams on first render if given searchTerm', () => {
			const { rerender } = renderHook(
				({ start }) =>
					useSearchPersonsByGeneralSearch(
						'someSearchTerm',
						start,
						10
					),
				{ initialProps: { start: 1 } }
			);

			expect(mockUseApi).toHaveBeenLastCalledWith(
				searchPersonsByGeneralSearch,
				{}
			);

			expect(mockSetApiParams).toHaveBeenCalledTimes(1);
			expect(mockSetApiParams).toHaveBeenLastCalledWith({
				searchTerm: 'someSearchTerm',
				start: 1,
				rows: 10,
			});

			rerender({ start: 11 });

			expect(mockSetApiParams).toHaveBeenCalledTimes(1);
		});

		it('passes on isLoading from useApi', () => {
			defaultReturnFromMockUseApi.isLoading = false;

			const { result } = renderHook(() =>
				useSearchPersonsByGeneralSearch('someSearchTerm', 1, 10)
			);

			expect(result.current.isLoading).toBe(false);

			defaultReturnFromMockUseApi.isLoading = true;
			mockUseApi.mockReturnValueOnce(defaultReturnFromMockUseApi);

			const { result: result2 } = renderHook(() =>
				useSearchPersonsByGeneralSearch('someSearchTerm', 1, 10)
			);

			expect(mockSetApiParams).toHaveBeenCalledTimes(2);

			expect(result2.current.isLoading).toBe(true);
		});

		it('passes on result from useApi', () => {
			const { result } = renderHook(() =>
				useSearchPersonsByGeneralSearch('someSearchTerm', 1, 10)
			);

			expect(result.current.result).toStrictEqual(
				defaultReturnFromMockUseApi.result
			);

			defaultReturnFromMockUseApi.result = {
				hasData: false,
				isError: true,
				error: new Error('someError'),
			};

			mockUseApi.mockReturnValueOnce(defaultReturnFromMockUseApi);

			const { result: result2 } = renderHook(() =>
				useSearchPersonsByGeneralSearch('someSearchTerm', 1, 10)
			);

			expect(mockSetApiParams).toHaveBeenCalledTimes(2);

			expect(result2.current.result).toStrictEqual(
				defaultReturnFromMockUseApi.result
			);
		});
	});

	describe('triggerSearchWithParams', () => {
		it('returns a function triggerSearchWithParams', () => {
			const { result } = renderHook(() =>
				useSearchPersonsByGeneralSearch('someSearchTerm', 1, 10)
			);
			expect(result.current.triggerSearchWithParams).toBeDefined();
		});

		it('triggerSearchWithParams takes searchTerm, start, rows and calls setApiParams if searchTerm is set', () => {
			const { result } = renderHook(() =>
				useSearchPersonsByGeneralSearch('someSearchTerm', 1, 10)
			);

			result.current.triggerSearchWithParams(
				'someOtherSearchTerm',
				11,
				20
			);

			expect(mockSetApiParams).toHaveBeenLastCalledWith({
				searchTerm: 'someOtherSearchTerm',
				start: 11,
				rows: 20,
			});

			result.current.triggerSearchWithParams('iAmSearching', 333, 500);

			expect(mockSetApiParams).toHaveBeenLastCalledWith({
				searchTerm: 'iAmSearching',
				start: 333,
				rows: 500,
			});
		});

		it('triggerSearchWithParams takes searchTerm, start, rows and does NOT call setApiParams if searchTerm is NOT set', () => {
			const { result } = renderHook(() =>
				useSearchPersonsByGeneralSearch('someSearchTerm', 1, 10)
			);

			expect(mockSetApiParams).toHaveBeenCalledTimes(1);

			result.current.triggerSearchWithParams('', 11, 20);
			expect(mockSetApiParams).toHaveBeenCalledTimes(1);

			result.current.triggerSearchWithParams('', 333, 500);
			expect(mockSetApiParams).toHaveBeenCalledTimes(1);
		});
	});
});
