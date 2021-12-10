import axios from 'axios';
import { renderHook, act } from '@testing-library/react-hooks/dom';
import useDataApi from '../../src/hooks/useDataApi';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('The useDataApi hook', () => {
	it('should take initialUrl and initialData', () => {
		const { result } = renderHook(() => useDataApi('', ''));
	});

	it('should return data, isLoading, isError as well as setUrl', () => {
		const { result } = renderHook(() =>
			useDataApi('', { data: 'someInitialData' })
		);

		const [{ data, isLoading, isError }, setUrl] = result.current;

		expect(data).toStrictEqual('initialData');
		expect(isLoading).toBeTruthy();
		expect(isError).toBeFalsy();
		expect(setUrl).toBeDefined();
	});

	it('should not call axios if initialUrl is empty', () => {
		renderHook(() => useDataApi('', ''));

		expect(mockedAxios).toHaveBeenCalledTimes(0);
	});

	it('should call axios if initialUrl is provided', () => {
		renderHook(() => useDataApi('someUrl', ''));

		expect(mockedAxios).toHaveBeenCalledTimes(1);
		expect(mockedAxios).toHaveBeenCalledWith('someUrl');
	});

	it('should change loading state if axios call is successful', () => {
		mockedAxios.get.mockResolvedValueOnce({ data: 'someData' });
		const { result } = renderHook(() => useDataApi('someUrl', ''));

		const [{ data, isLoading, isError }, setUrl] = result.current;

		expect(isLoading).toBeFalsy();
	});

	it('should change data if axios call is successful', () => {
		mockedAxios.get.mockResolvedValueOnce({ data: 'someData' });
		const { result } = renderHook(() => useDataApi('someUrl', ''));

		const [{ data, isLoading, isError }, setUrl] = result.current;

		expect(data).toStrictEqual({ data: 'someData' });
	});
	it.todo('should change loading state if axios call is NOT successful');
});
