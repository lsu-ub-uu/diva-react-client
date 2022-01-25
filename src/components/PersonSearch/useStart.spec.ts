// eslint-disable-next-line import/no-extraneous-dependencies
import { renderHook } from '@testing-library/react-hooks/dom';
import useStart from './useStart';

describe('the useStart hook', () => {
	it('takes a start value', () => {
		renderHook(() => useStart(1));
	});

	it('returns the given start value if start >= 1', () => {
		const { rerender, result } = renderHook(({ start }) => useStart(start), {
			initialProps: { start: 1 },
		});

		expect(result.current.start).toStrictEqual(1);

		rerender({ start: 999999 });
		expect(result.current.start).toStrictEqual(999999);

		rerender({ start: 0 });
		expect(result.current.start).not.toStrictEqual(0);

		rerender({ start: -99 });
		expect(result.current.start).not.toStrictEqual(-99);
	});

	it('returns 1 if start < 1', () => {
		const { rerender, result } = renderHook(({ start }) => useStart(start), {
			initialProps: { start: 1 },
		});

		expect(result.current.start).toStrictEqual(1);

		rerender({ start: 0 });
		expect(result.current.start).toStrictEqual(1);

		rerender({ start: -99 });
		expect(result.current.start).toStrictEqual(1);
	});
});
