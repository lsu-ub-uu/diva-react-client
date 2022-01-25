// eslint-disable-next-line import/no-extraneous-dependencies
import { renderHook } from '@testing-library/react-hooks/dom';
import useRows from './useRows';
import useRowsWithString from './useRowsWithString';

jest.mock('./useRows');
const mockUseRows = useRows as jest.MockedFunction<typeof useRows>;

describe('the useRowsWithString hook', () => {
	it('should take rowsString:string, maxRows and defaultRows', () => {
		renderHook(() => useRowsWithString('25', 100, 10));
	});

	it('should call useRows with an int representation of rowsString, maxRows and defaultRows', () => {
		const { rerender } = renderHook(
			({ rowsString, maxRows, defaultRows }) =>
				useRowsWithString(rowsString, maxRows, defaultRows),
			{ initialProps: { rowsString: '25', maxRows: 100, defaultRows: 10 } }
		);

		expect(mockUseRows).toHaveBeenLastCalledWith(25, 100, 10);

		rerender({ rowsString: '100', maxRows: 3434, defaultRows: 23423 });

		expect(mockUseRows).toHaveBeenLastCalledWith(100, 3434, 23423);

		rerender({ rowsString: '-40', maxRows: 3434, defaultRows: 23423 });

		expect(mockUseRows).toHaveBeenLastCalledWith(-40, 3434, 23423);
	});

	it('if the given rowsString is parsed to NaN, pass defaultRows to useRows', () => {
		const { rerender } = renderHook(
			({ rowsString, maxRows, defaultRows }) =>
				useRowsWithString(rowsString, maxRows, defaultRows),
			{ initialProps: { rowsString: '', maxRows: 100, defaultRows: 10 } }
		);

		expect(mockUseRows).toHaveBeenLastCalledWith(10, 100, 10);

		rerender({ rowsString: 'someString', maxRows: 3434, defaultRows: 23423 });

		expect(mockUseRows).toHaveBeenLastCalledWith(23423, 3434, 23423);
	});

	it('should pass on what useRows returns', () => {
		let returnFromUseRows = { rows: 10 };
		mockUseRows.mockReturnValueOnce(returnFromUseRows);

		const { result, rerender } = renderHook(
			({ rowsString, maxRows, defaultRows }) =>
				useRowsWithString(rowsString, maxRows, defaultRows),
			{ initialProps: { rowsString: '25', maxRows: 100, defaultRows: 10 } }
		);

		expect(result.current).toStrictEqual(returnFromUseRows);

		returnFromUseRows = { rows: 234234 };
		mockUseRows.mockReturnValueOnce(returnFromUseRows);

		rerender({ rowsString: '100', maxRows: 3434, defaultRows: 23423 });

		expect(result.current).toStrictEqual(returnFromUseRows);
	});
});
