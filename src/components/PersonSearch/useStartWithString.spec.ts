// eslint-disable-next-line import/no-extraneous-dependencies
import { renderHook } from '@testing-library/react-hooks/dom';
import useStart from './useStart';
import useStartWithString from './useStartWithString';

jest.mock('./useStart');
const mockUseStart = useStart as jest.MockedFunction<typeof useStart>;

describe('the useStartWithString hook', () => {
	it('takes a startString:string', () => {
		renderHook(() => useStartWithString('50'));
	});

	it('should call useStart with an int representation of startString', () => {
		const { rerender } = renderHook(
			({ startString }) => useStartWithString(startString),
			{
				initialProps: { startString: '10' },
			}
		);

		expect(mockUseStart).toHaveBeenLastCalledWith(10);

		rerender({ startString: '50' });
		expect(mockUseStart).toHaveBeenLastCalledWith(50);
	});

	it('if the given startString is parsed to NaN, pass 1 to useStart', () => {
		const { rerender } = renderHook(
			({ startString }) => useStartWithString(startString),
			{
				initialProps: { startString: '' },
			}
		);

		expect(mockUseStart).toHaveBeenLastCalledWith(1);

		rerender({ startString: 'someString' });
		expect(mockUseStart).toHaveBeenLastCalledWith(1);
	});

	it('should pass on what useStart returns', () => {
		let returnedByMockUseStart = { start: 5 };
		mockUseStart.mockReturnValueOnce(returnedByMockUseStart);

		const { rerender, result } = renderHook(
			({ startString }) => useStartWithString(startString),
			{
				initialProps: { startString: '40' },
			}
		);

		expect(result.current).toStrictEqual(returnedByMockUseStart);

		returnedByMockUseStart = { start: 234 };
		mockUseStart.mockReturnValueOnce(returnedByMockUseStart);

		rerender({ startString: '3' });
		expect(result.current).toStrictEqual(returnedByMockUseStart);
	});
});
