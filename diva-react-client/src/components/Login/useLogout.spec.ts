import { renderHook } from '@testing-library/react-hooks/dom';
import axios from 'axios';
import { LOGIN_STATUS, useAuth } from '../../context/AuthContext';
import useLogout from './useLogout';

jest.mock('../../context/AuthContext');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const someOtherAuth = {
	deleteUrl: 'someOtherDeleteUrl',
	idFromLogin: 'someOtherId',
	status: LOGIN_STATUS.LOGGED_IN,
	token: 'someOtherToken',
};

const mockOnAuthChange = jest.fn();

beforeAll(() => {
	mockedAxios.delete.mockResolvedValue({
		status: 200,
	});

	mockUseAuth.mockReturnValue({
		auth: {
			deleteUrl: 'someDeleteUrl',
			idFromLogin: 'someId',
			status: LOGIN_STATUS.LOGGED_IN,
			token: 'someToken',
		},
		onAuthChange: mockOnAuthChange,
	});
});

describe('useLogout', () => {
	it('calls useAuth', () => {
		renderHook(() => useLogout());

		expect(mockUseAuth).toHaveBeenCalled();
	});
	it('returns function logout()', () => {
		const { result } = renderHook(() => useLogout());

		expect(result.current.logout).toBeDefined();
	});
	it('if auth.status is Logged_out and logout() is called, throw error', async () => {
		mockUseAuth.mockReturnValueOnce({
			auth: {
				deleteUrl: '',
				idFromLogin: '',
				status: LOGIN_STATUS.LOGGED_OUT,
				token: '',
			},
			onAuthChange: mockOnAuthChange,
		});

		const { result } = renderHook(() => useLogout());

		expect.assertions(1);

		try {
			await result.current.logout();
		} catch (error) {
			expect(error).toStrictEqual(
				new Error('Cannot log out if already logged out.')
			);
		}
	});
	describe('if auth.status is Logged_in and logout() is called', () => {
		it('call axios.delete to auth.deleteUrl', async () => {
			const { result, rerender } = renderHook(() => useLogout());

			expect(axios.delete).not.toHaveBeenCalled();

			result.current.logout();

			expect(axios.delete).toHaveBeenCalledWith(
				'someDeleteUrl',
				expect.any(Object)
			);

			mockUseAuth.mockReturnValueOnce({
				auth: someOtherAuth,
				onAuthChange: mockOnAuthChange,
			});

			rerender();

			result.current.logout();

			expect(axios.delete).toHaveBeenCalledWith(
				'someOtherDeleteUrl',
				expect.any(Object)
			);
		});
		it('call axios.delete with header authToken = auth.token', async () => {
			const { result, rerender } = renderHook(() => useLogout());

			result.current.logout();

			expect(axios.delete).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					headers: {
						authToken: 'someToken',
					},
					data: expect.any(String),
				})
			);

			mockUseAuth.mockReturnValueOnce({
				auth: someOtherAuth,
				onAuthChange: mockOnAuthChange,
			});

			rerender();

			result.current.logout();

			expect(axios.delete).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					headers: {
						authToken: 'someOtherToken',
					},
					data: expect.any(String),
				})
			);
		});
		it('call axios.delete with body = auth.token', () => {
			const { result, rerender } = renderHook(() => useLogout());

			result.current.logout();

			expect(axios.delete).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					headers: expect.any(Object),
					data: 'someToken',
				})
			);

			mockUseAuth.mockReturnValueOnce({
				auth: someOtherAuth,
				onAuthChange: mockOnAuthChange,
			});

			rerender();

			result.current.logout();

			expect(axios.delete).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					headers: expect.any(Object),
					data: 'someOtherToken',
				})
			);
		});
	});
	describe('handle response from axios.delete', () => {
		it('if axios.delete resolves with 200, call onAuthChange with LOGIN_STATUS.Logged_out and empty strings otherwise', async () => {
			const { result } = renderHook(() => useLogout());

			await result.current.logout();

			expect(mockOnAuthChange).toHaveBeenCalledWith({
				deleteUrl: '',
				idFromLogin: '',
				token: '',
				status: LOGIN_STATUS.LOGGED_OUT,
			});
		});

		it('if axios.delete resolves, but not with 200, throw error with statusMessage from axios', async () => {
			const { result } = renderHook(() => useLogout());

			expect.assertions(2);

			const expectedError = new Error('Some statusText from axios.');
			mockedAxios.delete.mockResolvedValueOnce({
				status: 201,
				statusText: 'Some statusText from axios.',
			});

			try {
				await result.current.logout();
			} catch (error) {
				expect(error).toStrictEqual(expectedError);
			}

			const expectedOtherError = new Error('Some other statusText from axios.');
			mockedAxios.delete.mockResolvedValueOnce({
				status: 418,
				statusText: 'Some other statusText from axios.',
			});

			try {
				await result.current.logout();
			} catch (error) {
				expect(error).toStrictEqual(expectedOtherError);
			}
		});
		it('if axios.delete rejects, reject with error', async () => {
			const { result } = renderHook(() => useLogout());

			expect.assertions(1);
			const expectedError = new Error('Some error from axios.');
			mockedAxios.delete.mockRejectedValueOnce(expectedError);

			try {
				await result.current.logout();
			} catch (error) {
				expect(error).toStrictEqual(expectedError);
			}
		});
	});
});
