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

beforeAll(() => {
	mockedAxios.delete.mockResolvedValue({
		data: { someField: 'someDefaultData' },
	});

	mockUseAuth.mockReturnValue({
		auth: {
			deleteUrl: 'someDeleteUrl',
			idFromLogin: 'someId',
			status: LOGIN_STATUS.LOGGED_IN,
			token: 'someToken',
		},
		onAuthChange: jest.fn(),
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
	it('if auth.status is Logged_out and logout() is called, throw error', () => {
		mockUseAuth.mockReturnValueOnce({
			auth: {
				deleteUrl: '',
				idFromLogin: '',
				status: LOGIN_STATUS.LOGGED_OUT,
				token: '',
			},
			onAuthChange: jest.fn(),
		});

		const { result } = renderHook(() => useLogout());

		expect.assertions(1);

		try {
			result.current.logout();
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
				onAuthChange: jest.fn(),
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
				})
			);

			mockUseAuth.mockReturnValueOnce({
				auth: someOtherAuth,
				onAuthChange: jest.fn(),
			});

			rerender();

			result.current.logout();

			expect(axios.delete).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					headers: {
						authToken: 'someOtherToken',
					},
				})
			);
		});
		it.todo('call axios.delete with body = auth.token');
	});
	describe('handle result from axios.delete', () => {
		it.todo(
			'if axios.delete resolves, call onAuthChange with LOGIN_STATUS.Logged_out and empty strings otherwise'
		);
		it.todo('if axios.delete rejects, throw error');
	});
});
