import { renderHook, act } from '@testing-library/react-hooks/dom';
import { LOGIN_STATUS, useAuth } from '../../context/AuthContext';
import useApi from '../useApi';

const mockApiToCall = jest.fn();

jest.mock('../../context/AuthContext');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

beforeEach(() => {
	mockApiToCall.mockImplementation(() => {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve('someResolve');
			}, 100);
		});
	});

	mockUseAuth.mockReturnValue({
		auth: {
			deleteUrl: 'someDeleteUrl',
			idFromLogin: 'someId',
			status: LOGIN_STATUS.LOGGED_IN,
			token: 'someToken',
			domain: 'someDomain',
		},
		onAuthChange: jest.fn(),
	});
});

describe('The useApi hook', () => {
	it('should take parameters: an API to call as well as parameters for that API call', () => {
		const { rerender } = renderHook(
			({ apiToCall, initialApiParams }) =>
				useApi(apiToCall, initialApiParams),
			{
				initialProps: {
					apiToCall: mockApiToCall,
					initialApiParams: { someParam: 'someValue' },
				},
			}
		);

		rerender({
			apiToCall: mockApiToCall,
			initialApiParams: { someParam: 'bar' },
		});
	});

	it('should call useAuth', () => {
		renderHook(
			({ apiToCall, initialApiParams }) =>
				useApi(apiToCall, initialApiParams),
			{
				initialProps: {
					apiToCall: mockApiToCall,
					initialApiParams: { paramOne: 'one', paramTwo: 2 },
				},
			}
		);
		expect(mockUseAuth).toHaveBeenCalled();
	});

	it('should call apiToCall with params and authToken if it is set', () => {
		const { rerender } = renderHook(
			({ apiToCall, initialApiParams }) =>
				useApi(apiToCall, initialApiParams),
			{
				initialProps: {
					apiToCall: mockApiToCall,
					initialApiParams: { paramOne: 'one', paramTwo: 2 },
				},
			}
		);

		expect(mockApiToCall).toHaveBeenCalledTimes(1);
		expect(mockApiToCall).toHaveBeenLastCalledWith('one', 2, 'someToken');

		mockUseAuth.mockReturnValue({
			auth: {
				deleteUrl: 'someDeleteUrl',
				idFromLogin: 'someId',
				status: LOGIN_STATUS.LOGGED_IN,
				token: 'someOtherToken',
				domain: 'someOtherDomain',
			},
			onAuthChange: jest.fn(),
		});

		rerender();

		expect(mockApiToCall).toHaveBeenLastCalledWith(
			'one',
			2,
			'someOtherToken'
		);
	});

	it('should call apiToCall with params but not with authToken if it is an empty string', async () => {
		mockUseAuth.mockReturnValue({
			auth: {
				deleteUrl: '',
				idFromLogin: '',
				status: LOGIN_STATUS.LOGGED_OUT,
				token: '',
				domain: '',
			},
			onAuthChange: jest.fn(),
		});

		const { result } = renderHook(
			({ apiToCall, initialApiParams }) =>
				useApi(apiToCall, initialApiParams),
			{
				initialProps: {
					apiToCall: mockApiToCall,
					initialApiParams: { paramOne: 'one', paramTwo: 2 },
				},
			}
		);

		expect(mockApiToCall).toHaveBeenCalledTimes(1);
		expect(mockApiToCall).toHaveBeenLastCalledWith('one', 2);

		act(() => {
			result.current.setApiParams({ paramOne: 'three', paramTwo: 4 });
		});

		await expect(mockApiToCall).toHaveBeenLastCalledWith('three', 4);
	});

	it('should not call apiToCall if params are empty', () => {
		renderHook(
			({ apiToCall, initialApiParams }) =>
				useApi(apiToCall, initialApiParams),
			{
				initialProps: {
					apiToCall: mockApiToCall,
					initialApiParams: {},
				},
			}
		);

		expect(mockApiToCall).toHaveBeenCalledTimes(0);
	});

	it('should return setApiParams method, which can be used to send new params and should trigger new call to apiToCall', async () => {
		const { result, waitFor } = renderHook(
			({ apiToCall, initialApiParams }) =>
				useApi(apiToCall, initialApiParams),
			{
				initialProps: {
					apiToCall: mockApiToCall,
					initialApiParams: { paramOne: 'one', paramTwo: 2 },
				},
			}
		);

		expect(result.current.setApiParams).toBeDefined();

		act(() => {
			result.current.setApiParams({ paramOne: 'newOne', paramTwo: 42 });
		});

		await waitFor(() => {
			expect(mockApiToCall).toHaveBeenCalledTimes(2);
			expect(mockApiToCall).toHaveBeenNthCalledWith(
				2,
				'newOne',
				42,
				expect.any(String)
			);
		});
	});

	describe('it should return boolean isLoading,', () => {
		it('which should be true during loading and false when the call resolves', async () => {
			jest.useFakeTimers();
			mockApiToCall.mockImplementationOnce(() => {
				return new Promise((resolve) => {
					setTimeout(() => {
						resolve('someResolve');
					}, 100);
				});
			});

			const { result, waitFor } = renderHook(() =>
				useApi(mockApiToCall, { someParam: 'someValue' })
			);

			expect(result.current.isLoading).toBe(true);

			jest.advanceTimersByTime(100);

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			jest.useRealTimers();
		});

		it('which should be true during loading and false when the call rejects', async () => {
			jest.useFakeTimers();
			mockApiToCall.mockImplementationOnce(() => {
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						reject(new Error('someError'));
					}, 100);
				});
			});

			const { result, waitFor } = renderHook(() =>
				useApi(mockApiToCall, { someParam: 'someValue' })
			);

			expect(result.current.isLoading).toBe(true);

			jest.advanceTimersByTime(100);

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			jest.useRealTimers();
		});
	});

	describe('it should return result.isError', () => {
		it('which should be true if apiCall rejects', async () => {
			mockApiToCall.mockRejectedValueOnce(new Error('some Error'));

			const { result, waitFor } = renderHook(() =>
				useApi(mockApiToCall, { someParam: 'someValue' })
			);

			await waitFor(() => {
				expect(result.current.result.isError).toBe(true);
			});
		});

		it('which should be false if apiCall resolves', async () => {
			const { result, waitFor } = renderHook(() =>
				useApi(mockApiToCall, { someParam: 'someValue' })
			);

			await waitFor(() => {
				expect(result.current.result.isError).toBe(false);
			});
		});

		it('which should be reset if new parameters are sent', async () => {
			jest.useFakeTimers();
			mockApiToCall.mockImplementationOnce(() => {
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						reject(new Error('someError'));
					}, 100);
				});
			});

			const { result, waitFor } = renderHook(
				({ apiToCall, initialApiParams }) =>
					useApi(apiToCall, initialApiParams),
				{
					initialProps: {
						apiToCall: mockApiToCall,
						initialApiParams: { paramOne: 'one', paramTwo: 2 },
					},
				}
			);

			expect(result.current.result.isError).toBe(false);

			jest.advanceTimersByTime(100);

			await waitFor(() => {
				expect(result.current.result.isError).toBe(true);
			});

			mockApiToCall.mockImplementationOnce(() => {
				return new Promise((resolve) => {
					setTimeout(() => {
						resolve('someResolve');
					}, 100);
				});
			});

			act(() => {
				result.current.setApiParams({
					paramOne: 'newOne',
					paramTwo: 42,
				});
			});

			expect(result.current.result.isError).toBe(false);

			jest.advanceTimersByTime(100);

			await waitFor(() => {
				expect(result.current.result.isError).toBe(false);
				expect(result.current.isLoading).toBe(false);
			});

			jest.useRealTimers();
		});
	});

	describe('it should return result.error', () => {
		it('which should be undefined if apiCall resolves', async () => {
			const { result, waitFor } = renderHook(() =>
				useApi(mockApiToCall, { someParam: 'someValue' })
			);

			await waitFor(() => {
				expect(result.current.result.error).toBeUndefined();
			});
		});

		it('which should pass on Error if apiCall rejects', async () => {
			const expectedError = new Error('some Error');
			mockApiToCall.mockRejectedValueOnce(expectedError);

			const { result, waitFor } = renderHook(() =>
				useApi(mockApiToCall, { someParam: 'someValue' })
			);

			await waitFor(() => {
				expect(result.current.result.error).toStrictEqual(
					expectedError
				);
			});
		});

		it('which should be reset if new parameters are sent', async () => {
			jest.useFakeTimers();
			const expectedError = new Error('someError');
			mockApiToCall.mockImplementationOnce(() => {
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						reject(expectedError);
					}, 100);
				});
			});

			const { result, waitFor } = renderHook(
				({ apiToCall, initialApiParams }) =>
					useApi(apiToCall, initialApiParams),
				{
					initialProps: {
						apiToCall: mockApiToCall,
						initialApiParams: { paramOne: 'one', paramTwo: 2 },
					},
				}
			);

			expect(result.current.result.error).toBeUndefined();

			jest.advanceTimersByTime(100);

			await waitFor(() => {
				expect(result.current.result.error).toStrictEqual(
					expectedError
				);
			});

			mockApiToCall.mockImplementationOnce(() => {
				return new Promise((resolve) => {
					setTimeout(() => {
						resolve('someResolve');
					}, 100);
				});
			});

			act(() => {
				result.current.setApiParams({
					paramOne: 'newOne',
					paramTwo: 42,
				});
			});

			expect(result.current.result.error).toBeUndefined();

			jest.advanceTimersByTime(100);

			await waitFor(() => {
				expect(result.current.result.error).toBeUndefined();
				expect(result.current.isLoading).toBe(false);
			});

			jest.useRealTimers();
		});
	});

	describe('it should return the result', () => {
		it('if apiCall rejects, the result.hasData should be false and the data undefined', async () => {
			mockApiToCall.mockRejectedValueOnce(new Error('some Error'));

			const { result, waitFor } = renderHook(() =>
				useApi(mockApiToCall, { someParam: 'someValue' })
			);

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
				expect(result.current.result.hasData).toBe(false);
				expect(result.current.result.data).toBeUndefined();
			});
		});

		it('if apiCall resolves, result.hasData should be true and the data set to what was returned from the apiCall', async () => {
			mockApiToCall.mockResolvedValueOnce('someString');

			const { result, waitFor } = renderHook(() =>
				useApi<string>(mockApiToCall, { someParam: 'someValue' })
			);

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
				expect(result.current.result.hasData).toBe(true);
				expect(result.current.result.data).toStrictEqual('someString');
			});
		});

		it('on subsequent apiCalls, result should be reset before each new apiCall', async () => {
			jest.useFakeTimers();
			mockApiToCall.mockImplementationOnce(() => {
				return new Promise((resolve) => {
					setTimeout(() => {
						resolve('someResolve');
					}, 100);
				});
			});

			const { result, waitFor } = renderHook(
				({ apiToCall, initialApiParams }) =>
					useApi(apiToCall, initialApiParams),
				{
					initialProps: {
						apiToCall: mockApiToCall,
						initialApiParams: { paramOne: 'one', paramTwo: 2 },
					},
				}
			);

			expect(result.current.result.hasData).toBe(false);

			jest.advanceTimersByTime(100);

			await waitFor(() => {
				expect(result.current.result.hasData).toBe(true);
				expect(result.current.result.data).toStrictEqual('someResolve');
			});

			mockApiToCall.mockImplementationOnce(() => {
				return new Promise((resolve) => {
					setTimeout(() => {
						resolve('someOtherResolve');
					}, 100);
				});
			});

			act(() => {
				result.current.setApiParams({
					paramOne: 'newOne',
					paramTwo: 42,
				});
			});

			expect(result.current.result.hasData).toBe(false);
			expect(result.current.result.data).toBeUndefined();

			jest.advanceTimersByTime(100);

			await waitFor(() => {
				expect(result.current.result.hasData).toBe(true);
				expect(result.current.result.data).toStrictEqual(
					'someOtherResolve'
				);
			});

			jest.useRealTimers();
		});
	});
});
