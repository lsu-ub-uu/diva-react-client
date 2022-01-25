// eslint-disable-next-line import/no-extraneous-dependencies
import { renderHook } from '@testing-library/react-hooks/dom';
import useRows from './useRows';

describe('the useRows hook', () => {
	it('should take rows, maxRows and defaultRows', () => {
		renderHook(() => useRows(25, 100, 10));
	});

	it('should return the input rows value if rows>=1 and rows<=maxRows', () => {
		const { result, rerender } = renderHook(
			({ rows, maxRows }) => useRows(rows, maxRows, 10),
			{ initialProps: { rows: 25, maxRows: 100 } }
		);

		expect(result.current.rows).toStrictEqual(25);

		rerender({ rows: 100, maxRows: 100 });

		expect(result.current.rows).toStrictEqual(100);

		rerender({ rows: 1001, maxRows: 1000 });

		expect(result.current.rows).not.toStrictEqual(1001);

		rerender({ rows: 0, maxRows: 1000 });

		expect(result.current.rows).not.toStrictEqual(0);

		rerender({ rows: -999, maxRows: 1000 });

		expect(result.current.rows).not.toStrictEqual(0);
	});

	it('should return the defaultRows value if rows <1 or rows > maxRows', () => {
		const { result, rerender } = renderHook(
			({ rows, maxRows, defaultRows }) => useRows(rows, maxRows, defaultRows),
			{ initialProps: { rows: 0, maxRows: 100, defaultRows: 10 } }
		);
		expect(result.current.rows).toStrictEqual(10);

		rerender({ rows: 1001, maxRows: 1000, defaultRows: 50 });
		expect(result.current.rows).toStrictEqual(50);

		rerender({ rows: -50, maxRows: 50, defaultRows: 25 });
		expect(result.current.rows).toStrictEqual(25);
	});
});
