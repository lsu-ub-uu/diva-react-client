// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';
import { renderHook } from '@testing-library/react-hooks/dom';
import useDataApi from '../../src/hooks/useDataApi';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeAll(() => {
	mockedAxios.get.mockResolvedValue({ data: 'someDefaultData' });
});

describe('The useDataApi hook', () => {
	it('should take initialUrl and initialData', async () => {
		renderHook(() => useDataApi('', ''));
	});

	it('should return data, isLoading, isError as well as setUrl', async () => {
		const { result } = renderHook(() =>
			useDataApi('', { data: 'someInitialData' })
		);

		expect(result.current[0].data).toStrictEqual({ data: 'someInitialData' });
		expect(result.current[0].isLoading).toBeTruthy();
		expect(result.current[0].isError).toBeFalsy();
		expect(result.current[1]).toBeDefined();
	});

	it('should not call axios if initialUrl is empty', async () => {
		renderHook(() => useDataApi('', ''));

		expect(mockedAxios).toHaveBeenCalledTimes(0);
	});

	it('should call axios if initialUrl is provided', async () => {
		renderHook(() => useDataApi('someUrl', ''));

		expect(mockedAxios).toHaveBeenCalledTimes(1);
		expect(mockedAxios).toHaveBeenCalledWith('someUrl');
	});

	it('should change loading state if axios call is successful', async () => {
		// mockedAxios.get.mockResolvedValueOnce({ data: 'data' });
		mockedAxios.get.mockImplementationOnce(() =>
			Promise.resolve({
				status: 200,
				data: 'data',
			})
		);
		const { result, waitFor } = renderHook(() => useDataApi('someUrl', ''));

		expect(mockedAxios).toHaveBeenCalledTimes(1);
		expect(mockedAxios).toHaveBeenCalledWith('someUrl');
		await waitFor(
			() => {
				expect(result.current[0].isLoading).toBeFalsy();
			},
			{ interval: 500 }
		);
	});

	it('should return data from axios if call is successful', async () => {
		mockedAxios.get.mockResolvedValueOnce({ data: 'someData' });
		const { result, waitFor } = renderHook(() =>
			useDataApi('someUrl', { data: 'initialData' })
		);

		const [{ data, isLoading }] = result.current;

		await waitFor(() => {
			expect(isLoading).toBeFalsy();
			expect(data).toStrictEqual({ data: 'someData' });
			console.log(data);
		});
	});

	it('should return data from axios if call is successful 2', async () => {
		mockedAxios.get.mockResolvedValueOnce({ data: 'someOtherData' });
		const { result, waitFor } = renderHook(() =>
			useDataApi('someUrl', { data: 'initialData' })
		);

		const [{ data, isLoading }] = result.current;

		await waitFor(() => {
			expect(isLoading).toBeFalsy();
			expect(data).toStrictEqual({ data: 'someOtherData' });
			console.log(data);
		});
		console.log(data);
	});
	it.todo('should change loading state if axios call is NOT successful');
});
