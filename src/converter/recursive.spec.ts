import * as fib from './recursive';

const spy = jest.spyOn(fib, 'recursion');

describe('recursion', () => {
	it('does it', () => {
		const final = fib.recursion(0);

		expect(final).toStrictEqual(3);
		expect(spy).toHaveBeenCalledTimes(3);
	});
});

describe('memoization', () => {
	it('should memoize correctly', () => {
		const mock = jest.spyOn(fib, 'memoization');

		const result = fib.memoization(50);
		expect(result).toBe(12586269025);
		expect(mock).toHaveBeenCalledTimes(49);

		mock.mockRestore();
	});
});
