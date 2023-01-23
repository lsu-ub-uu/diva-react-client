import { renderHook } from '@testing-library/react-hooks/dom';
import { useSearchParams } from 'react-router-dom';
import usePersonSearchParams from './usePersonSearchParams';

jest.mock('react-router-dom');
const mockUseSearchParams = useSearchParams as jest.MockedFunction<
	typeof useSearchParams
>;

let receivedSearchParams: URLSearchParams;

const mockSetSearchParams = jest.fn();

const urlSearchParamsToReturn: URLSearchParams = new URLSearchParams();

const DEFAULT_START = 1;
const DEFAULT_ROWS = 10;
const MAX_ROWS = 1000;

beforeEach(() => {
	urlSearchParamsToReturn.set('searchTerm', 'someDefaultSearchTerm');
	urlSearchParamsToReturn.set('start', '101');
	urlSearchParamsToReturn.set('rows', '50');
	mockUseSearchParams.mockReturnValue([
		urlSearchParamsToReturn,
		mockSetSearchParams,
	]);

	mockSetSearchParams.mockImplementation(
		(newSearchParams: URLSearchParams) => {
			receivedSearchParams = newSearchParams;
		}
	);
});

describe('the usePersonSearchParams hook', () => {
	it('calls the useSearchParams hook', () => {
		renderHook(() => usePersonSearchParams());

		expect(mockUseSearchParams).toHaveBeenCalledTimes(1);
	});

	it('returns searchTerm: string, start: number, rows: number from useSearchParams', () => {
		const { result, rerender } = renderHook(() => usePersonSearchParams());

		expect(result.current.searchTerm).toStrictEqual(
			'someDefaultSearchTerm'
		);
		expect(result.current.start).toStrictEqual(101);
		expect(result.current.rows).toStrictEqual(50);

		urlSearchParamsToReturn.set('searchTerm', 'someOtherSearchTerm');
		urlSearchParamsToReturn.set('start', '50');
		urlSearchParamsToReturn.set('rows', '300');

		mockUseSearchParams.mockReturnValueOnce([
			urlSearchParamsToReturn,
			mockSetSearchParams,
		]);

		rerender();

		expect(result.current.searchTerm).toStrictEqual('someOtherSearchTerm');
		expect(result.current.start).toStrictEqual(50);
		expect(result.current.rows).toStrictEqual(300);
	});

	describe('searchTerm', () => {
		it("if searchTerm is not existing, returns searchTerm=''", () => {
			urlSearchParamsToReturn.delete('searchTerm');
			mockOnceWithSearchParams(urlSearchParamsToReturn);
			const { result } = renderHook(() => usePersonSearchParams());

			expect(result.current.searchTerm).toStrictEqual('');
		});
	});

	describe('start', () => {
		it('if start is NaN (not set or not a numeric), returns start=1', () => {
			mockReturnedStartValueOnce('');
			const { result, rerender } = renderHook(() =>
				usePersonSearchParams()
			);
			expect(result.current.start).toStrictEqual(DEFAULT_START);

			mockReturnedStartValueOnce('22');
			rerender();
			expect(result.current.start).toStrictEqual(22);

			mockReturnedStartValueOnce('someString');
			rerender();
			expect(result.current.start).toStrictEqual(DEFAULT_START);
		});

		it('if start<1, returns start=1', () => {
			mockReturnedStartValueOnce('0');
			const { result, rerender } = renderHook(() =>
				usePersonSearchParams()
			);
			expect(result.current.start).toStrictEqual(DEFAULT_START);

			mockReturnedStartValueOnce('22');
			rerender();
			expect(result.current.start).toStrictEqual(22);

			mockReturnedStartValueOnce('-999');
			rerender();
			expect(result.current.start).toStrictEqual(DEFAULT_START);
		});
	});

	describe('rows', () => {
		it('if rows is NaN (not set or not a numeric), returns rows=10', () => {
			mockReturnedRowsValueOnce('');
			const { result, rerender } = renderHook(() =>
				usePersonSearchParams()
			);
			expect(result.current.rows).toStrictEqual(DEFAULT_ROWS);

			mockReturnedRowsValueOnce('22');
			rerender();
			expect(result.current.rows).toStrictEqual(22);

			mockReturnedRowsValueOnce('someString');
			rerender();
			expect(result.current.rows).toStrictEqual(DEFAULT_ROWS);
		});

		it('if rows<1, returns rows=10', () => {
			mockReturnedRowsValueOnce('0');
			const { result, rerender } = renderHook(() =>
				usePersonSearchParams()
			);
			expect(result.current.rows).toStrictEqual(DEFAULT_ROWS);

			mockReturnedRowsValueOnce('22');
			rerender();
			expect(result.current.rows).toStrictEqual(22);

			mockReturnedRowsValueOnce('-999');
			rerender();
			expect(result.current.rows).toStrictEqual(DEFAULT_ROWS);
		});

		it('if rows > 1000, returns rows=1000', () => {
			mockReturnedRowsValueOnce('1001');
			const { result, rerender } = renderHook(() =>
				usePersonSearchParams()
			);
			expect(result.current.rows).toStrictEqual(MAX_ROWS);

			mockReturnedRowsValueOnce('9999');
			rerender();
			expect(result.current.rows).toStrictEqual(MAX_ROWS);
		});
	});

	describe('returns setters', () => {
		it('returns setters setSearchTerm, setStart, setRows', () => {
			const { result } = renderHook(() => usePersonSearchParams());

			expect(result.current.setSearchTerm).toBeDefined();
			expect(result.current.setStart).toBeDefined();
			expect(result.current.setRows).toBeDefined();
		});

		it("if setSearchTerm is called, it sets the new searchTerm with useSearchParam's setSearchParams, while leaving the other searchParams", () => {
			const { result } = renderHook(() => usePersonSearchParams());

			expect(mockUseSearchParams).toHaveBeenCalledTimes(1);

			result.current.setSearchTerm('someNewSearchTerm');

			expect(mockSetSearchParams).toHaveBeenCalledTimes(1);

			expect(receivedSearchParams.get('searchTerm')).toStrictEqual(
				'someNewSearchTerm'
			);
			expect(receivedSearchParams.get('start')).toStrictEqual('101');
			expect(receivedSearchParams.get('rows')).toStrictEqual('50');
		});

		it("if setStart is called, it sets the new start with useSearchParam's setSearchParams, while leaving the other searchParams", () => {
			const { result } = renderHook(() => usePersonSearchParams());

			expect(mockUseSearchParams).toHaveBeenCalledTimes(1);

			result.current.setStart(999);

			expect(mockSetSearchParams).toHaveBeenCalledTimes(1);

			expect(receivedSearchParams.get('searchTerm')).toStrictEqual(
				'someDefaultSearchTerm'
			);
			expect(receivedSearchParams.get('start')).toStrictEqual('999');
			expect(receivedSearchParams.get('rows')).toStrictEqual('50');
		});

		it("if setRows is called, it sets the new rows with useSearchParam's setSearchParams, while leaving the other searchParams", () => {
			const { result } = renderHook(() => usePersonSearchParams());

			expect(mockUseSearchParams).toHaveBeenCalledTimes(1);

			result.current.setRows(85);

			expect(mockSetSearchParams).toHaveBeenCalledTimes(1);

			expect(receivedSearchParams.get('searchTerm')).toStrictEqual(
				'someDefaultSearchTerm'
			);
			expect(receivedSearchParams.get('start')).toStrictEqual('101');
			expect(receivedSearchParams.get('rows')).toStrictEqual('85');
		});
	});
});

function mockReturnedRowsValueOnce(rowsString: string) {
	urlSearchParamsToReturn.set('rows', rowsString);
	mockOnceWithSearchParams(urlSearchParamsToReturn);
}

function mockReturnedStartValueOnce(startString: string) {
	urlSearchParamsToReturn.set('start', startString);
	mockOnceWithSearchParams(urlSearchParamsToReturn);
}

function mockOnceWithSearchParams(searchParams: URLSearchParams) {
	mockUseSearchParams.mockReturnValueOnce([
		searchParams,
		mockSetSearchParams,
	]);
}
