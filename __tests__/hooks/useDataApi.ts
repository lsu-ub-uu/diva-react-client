import * as actualAxios from 'axios';
import { renderHook, act } from '@testing-library/react-hooks/dom';
import useDataApi from '../../src/hooks/useDataApi';

jest.mock('axios');

const axios = actualAxios as jest.Mocked<typeof actualAxios>;

describe('The useDataApi hook', () => {
	it('should take initialUrl and initialData', () => {
		const { result } = renderHook(() => useDataApi('', ''));
	});

	it('should return data, isLoading, isError as well as setUrl', () => {
		const { result } = renderHook(() => useDataApi('', 'initialData'));

		const [{ data, isLoading, isError }, setUrl] = result.current;

		expect(data).toStrictEqual('initialData');
		expect(isLoading).toBeTruthy();
		expect(isError).toBeFalsy();
		expect(setUrl).toBeDefined();
	});

	it('should not call axios if initialUrl is empty', () => {
		const { result } = renderHook(() => useDataApi('', ''));

		expect(axios).toHaveBeenCalledTimes(0);
	});
});
