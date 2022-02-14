import { renderHook } from '@testing-library/react-hooks/dom';
import { getPersonById } from '../../src/cora/api/api';
import useGetPersonById from '../../src/hooks/useGetPersonById';
import { personWithDomain } from '../../testData/personObjectData';

jest.mock('../../src/cora/api/api');

const mockedGetPersonById = getPersonById as jest.MockedFunction<
	typeof getPersonById
>;

beforeAll(() => {
	mockedGetPersonById.mockResolvedValue(personWithDomain);
});

describe('the useGetPersonById hook', () => {
	it('should set error if id is empty', () => {
		const { result } = renderHook(() => useGetPersonById(''));

		expect(result.current.error).toBeDefined();
		expect(result.current.error?.message).toStrictEqual(
			'No personId was provided'
		);
	});

	it('should set isLoading to false if id is empty', () => {
		const { result } = renderHook(() => useGetPersonById(''));

		expect(result.current.isLoading).toBeFalsy();
	});

	it('should not call api if id is empty', () => {
		renderHook(() => useGetPersonById(''));

		expect(mockedGetPersonById).toHaveBeenCalledTimes(0);
	});

	describe('if an id is provided', () => {
		it('should pass the id to getPersonById', async () => {
			const { result, waitFor } = renderHook(() => useGetPersonById('someId'));

			expect(mockedGetPersonById).toHaveBeenCalledTimes(1);

			await waitFor(() => {
				expect(result.current.isLoading).toBeFalsy();
			});
		});

		it('should pass on person if getPersonById resolves', async () => {
			const { result, waitFor } = renderHook(() => useGetPersonById('someId'));

			await waitFor(() => {
				expect(result.current.person).toBeDefined();
				expect(result.current.person).toStrictEqual(personWithDomain);
			});
		});

		it('should set isLoading to true when promise is pending, to false when it resolves', async () => {
			jest.useFakeTimers();
			mockedGetPersonById.mockImplementationOnce(() => {
				return new Promise((resolve) => {
					setTimeout(() => {
						resolve(personWithDomain);
					}, 100);
				});
			});

			const { result, waitFor } = renderHook(() => useGetPersonById('someId'));

			expect(result.current.isLoading).toBeTruthy();

			jest.advanceTimersByTime(100);

			await waitFor(() => {
				expect(result.current.isLoading).toBeFalsy();
			});

			jest.useRealTimers();
		});

		it('should set isLoading to true when promise is pending, to false when it rejects', async () => {
			jest.useFakeTimers();
			mockedGetPersonById.mockImplementationOnce(() => {
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						reject(new Error('some error'));
					}, 100);
				});
			});

			const { result, waitFor } = renderHook(() => useGetPersonById('someId'));

			expect(result.current.isLoading).toBeTruthy();

			jest.advanceTimersByTime(100);

			await waitFor(() => {
				expect(result.current.isLoading).toBeFalsy();
			});

			jest.useRealTimers();
		});

		it('should pass on error if getPersonById throws an error', async () => {
			const errorFromGetPersonById = new Error('Some error from getPersonById');
			mockedGetPersonById.mockRejectedValueOnce(errorFromGetPersonById);

			const { result, waitFor } = renderHook(() => useGetPersonById('someId'));

			await waitFor(() => {
				expect(result.current.error).toBeDefined();
				expect(result.current.error).toStrictEqual(errorFromGetPersonById);
			});
		});
	});
});
