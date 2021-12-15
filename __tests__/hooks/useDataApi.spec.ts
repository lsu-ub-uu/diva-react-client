// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';
import { renderHook, act } from '@testing-library/react-hooks/dom';
import useDataApi from '../../src/hooks/useDataApi';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeAll(() => {
	mockedAxios.get.mockResolvedValue({ someField: 'someDefaultData' });
});

describe('The useDataApi hook', () => {
	it('should take initialUrl and initialData', async () => {
		renderHook(() => useDataApi('', ''));
	});

	it('should return data, isLoading, errors as well as setUrl', async () => {
		const { result } = renderHook(() =>
			useDataApi('', { someField: 'someInitialData' })
		);

		expect(result.current[0].data).toStrictEqual({
			someField: 'someInitialData',
		});
		expect(result.current[0].isLoading).toBeTruthy();
		expect(result.current[0].error).toBeNull();
		expect(result.current[1]).toBeDefined();
	});

	it('should not call axios if initialUrl is empty', async () => {
		renderHook(() => useDataApi('', ''));

		expect(mockedAxios.get).toHaveBeenCalledTimes(0);
	});

	describe('if initialURL is provided', () => {
		it('should call axios with that URL', async () => {
			const { result, waitFor } = renderHook(() => useDataApi('someUrl', ''));

			expect(mockedAxios.get).toHaveBeenCalledTimes(1);
			expect(mockedAxios.get).toHaveBeenCalledWith('someUrl');

			await waitFor(() => {
				expect(result.current[0].isLoading).toBeFalsy();
			});
		});

		it('should change loading state if axios call is successful', async () => {
			mockedAxios.get.mockImplementationOnce(() =>
				Promise.resolve({
					status: 200,
					data: 'data',
				})
			);
			const { result, waitFor } = renderHook(() => useDataApi('someUrl', ''));

			await waitFor(() => {
				expect(result.current[0].isLoading).toBeFalsy();
			});
		});

		it('should return data from axios if call is successful', async () => {
			mockedAxios.get.mockResolvedValueOnce({
				data: { someField: 'someData' },
			});
			const { result, waitFor } = renderHook(() =>
				useDataApi('someUrl', { someField: 'initialData' })
			);

			await waitFor(() => {
				expect(result.current[0].data).toStrictEqual({ someField: 'someData' });
			});
		});

		it('should return data from axios if call is successful 2', async () => {
			mockedAxios.get.mockResolvedValueOnce({
				data: { someField: 'someOtherData' },
			});
			const { result, waitFor } = renderHook(() =>
				useDataApi('someUrl', { someField: 'initialData' })
			);

			await waitFor(() => {
				expect(result.current[0].data).toStrictEqual({
					someField: 'someOtherData',
				});
			});
		});
	});

	describe('should handle errors', () => {
		it('should change loading state, set error and not change data if axios call is unsuccessful', async () => {
			mockedAxios.get.mockRejectedValueOnce({
				response: 'someResponse',
			});
			const { result, waitFor } = renderHook(() => useDataApi('someUrl', ''));

			await waitFor(() => {
				expect(result.current[0].isLoading).toBeFalsy();
				expect(result.current[0].error).not.toBeNull();
				expect(result.current[0].data).toStrictEqual('');
			});
		});

		it('should populate error message if axios returns response', async () => {
			mockedAxios.get.mockRejectedValueOnce({
				response: {
					data: 'Some error message',
					status: 404,
					headers: {},
				},
			});
			const { result, waitFor } = renderHook(() => useDataApi('someUrl', ''));

			await waitFor(() => {
				expect(result.current[0].error).not.toBeNull();
				expect(result.current[0].error?.message).toStrictEqual(
					'Some error message'
				);
			});
		});

		it('should populate error message if axios returns response 2', async () => {
			mockedAxios.get.mockRejectedValueOnce({
				response: {
					data: 'Some other error message',
					status: 404,
					headers: {},
				},
			});
			const { result, waitFor } = renderHook(() => useDataApi('someUrl', ''));

			await waitFor(() => {
				expect(result.current[0].error).not.toBeNull();
				expect(result.current[0].error?.message).toStrictEqual(
					'Some other error message'
				);
			});
		});

		it('should populate error message if axios returns XMLHttpRequest', async () => {
			mockedAxios.get.mockRejectedValueOnce({
				request: 'Some XMLHttpRequest',
			});
			const { result, waitFor } = renderHook(() => useDataApi('someUrl', ''));

			await waitFor(() => {
				expect(result.current[0].error).not.toBeNull();
				expect(result.current[0].error?.message).toStrictEqual(
					'The request was made but no response was received.'
				);
			});
		});

		it('should populate error message if axios returns general error', async () => {
			mockedAxios.get.mockRejectedValueOnce({
				message: 'Some general error message',
			});
			const { result, waitFor } = renderHook(() => useDataApi('someUrl', ''));

			await waitFor(() => {
				expect(result.current[0].error).not.toBeNull();
				expect(result.current[0].error?.message).toStrictEqual(
					'Some general error message'
				);
			});
		});
	});

	it('should call axios again if called with different URL', async () => {
		const { result, waitFor } = renderHook(() => useDataApi('someUrl', ''));

		expect(mockedAxios.get).toHaveBeenCalledTimes(1);
		expect(mockedAxios.get).toHaveBeenCalledWith('someUrl');

		await waitFor(() => {
			expect(result.current[0].isLoading).toBeFalsy();
		});

		const setUrl = result.current[1];

		act(() => {
			setUrl('someOtherUrl');
		});

		expect(result.current[0].isLoading).toBeTruthy();

		expect(mockedAxios.get).toHaveBeenCalledTimes(2);
		expect(mockedAxios.get).toHaveBeenCalledWith('someOtherUrl');

		await waitFor(() => {
			expect(result.current[0].isLoading).toBeFalsy();
		});
	});

	it('should reset error if called with different URL after error', async () => {
		mockedAxios.get.mockRejectedValueOnce({
			response: 'someResponse',
		});
		const { result, waitFor } = renderHook(() => useDataApi('someUrl', ''));

		expect(mockedAxios.get).toHaveBeenCalledTimes(1);
		expect(mockedAxios.get).toHaveBeenCalledWith('someUrl');

		await waitFor(() => {
			expect(result.current[0].error).not.toBeNull();
			expect(result.current[0].isLoading).toBeFalsy();
			expect(result.current[0].data).toStrictEqual('');
		});

		const setUrl = result.current[1];

		act(() => {
			setUrl('someOtherUrl');
		});

		expect(result.current[0].isLoading).toBeTruthy();
		expect(result.current[0].error).toBeNull();

		expect(mockedAxios.get).toHaveBeenCalledTimes(2);
		expect(mockedAxios.get).toHaveBeenCalledWith('someOtherUrl');

		await waitFor(() => {
			expect(result.current[0].isLoading).toBeFalsy();
			expect(result.current[0].error).toBeNull();
		});
	});
});
