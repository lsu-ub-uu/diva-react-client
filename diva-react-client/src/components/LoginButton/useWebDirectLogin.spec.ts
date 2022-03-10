import { renderHook } from '@testing-library/react-hooks/dom';
import { LOGIN_STATUS, useAuth } from '../../context/AuthContext';
import getIdpLoginServerPartFromUrl from './helpers';
import useWebRedirectLogin, { receiveMessage } from './useWebRedirectLogin';

jest.mock('./helpers');
const mockGetIdpLoginServerPartFromUrl =
	getIdpLoginServerPartFromUrl as jest.MockedFunction<
		typeof getIdpLoginServerPartFromUrl
	>;

jest.mock('../../context/AuthContext');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

const myWindow = {
	...window,
	addEventListener: jest.fn(),
	open: jest.fn(),
};

const returnedWindow = {
	...window,
	addEventListener: jest.fn(),
	open: jest.fn(),
};

const mockOnAuthChange = jest.fn();

beforeAll(() => {
	mockUseAuth.mockReturnValue({
		auth: {
			status: LOGIN_STATUS.LOGGED_OUT,
			token: '',
			idFromLogin: '',
			deleteUrl: '',
		},
		onAuthChange: mockOnAuthChange,
	});

	myWindow.open.mockReturnValue(returnedWindow);

	mockGetIdpLoginServerPartFromUrl.mockReturnValue('https://someUrl/login');
});

describe('useWebDirectLogin.spec', () => {
	it('takes url and window', () => {
		renderHook(() => useWebRedirectLogin('someUrl', myWindow));
	});

	it('calls useAuth', () => {
		renderHook(() => useWebRedirectLogin('someUrl', myWindow));

		expect(mockUseAuth).toHaveBeenCalledTimes(1);
	});

	it('returns function startLoginProcess', () => {
		const { result } = renderHook(() =>
			useWebRedirectLogin('someUrl', myWindow)
		);

		expect(result.current.startLoginProcess).toBeDefined();
	});

	it('calling startLoginProcess calls window.addEventListener', () => {
		const { result } = renderHook(() =>
			useWebRedirectLogin('someUrl', myWindow)
		);

		result.current.startLoginProcess();

		expect(myWindow.addEventListener).toHaveBeenCalledWith(
			'message',
			receiveMessage,
			false
		);
	});

	it('calling startLoginProcess calls window.open', () => {
		const { result } = renderHook(() =>
			useWebRedirectLogin('someUrl', myWindow)
		);

		result.current.startLoginProcess();

		expect(myWindow.open).toHaveBeenCalledWith('someUrl', 'DivaHelperWindow');

		const { result: result2 } = renderHook(() =>
			useWebRedirectLogin('someOtherUrl', myWindow)
		);

		result2.current.startLoginProcess();

		expect(myWindow.open).toHaveBeenCalledWith(
			'someOtherUrl',
			'DivaHelperWindow'
		);
	});

	const defaultAuthinfo = {
		token: 'someToken',
		idFromLogin: 'someIdFromLogin',
		actionLinks: { delete: { url: 'someDeleteUrl' } },
	};

	const defaultEvent: MessageEvent = new MessageEvent('someType', {
		origin: 'https://someUrl/login',
		data: defaultAuthinfo,
	});

	describe('receiveMessage', () => {
		it('takes a MessageEvent', () => {
			renderHook(() => useWebRedirectLogin('someUrl', myWindow));
			receiveMessage(defaultEvent);
		});

		it('calls onAuthUpdate with data', () => {
			renderHook(() => useWebRedirectLogin('someUrl', myWindow));
			receiveMessage(defaultEvent);

			expect(mockOnAuthChange).toHaveBeenCalledWith({
				status: LOGIN_STATUS.LOGGED_IN,
				token: defaultAuthinfo.token,
				idFromLogin: defaultAuthinfo.idFromLogin,
				deleteUrl: defaultAuthinfo.actionLinks.delete.url,
			});
		});

		it('calls getIdpLoginServerPartFromUrl with url', () => {
			renderHook(() => useWebRedirectLogin('someUrl', myWindow));
			receiveMessage(defaultEvent);

			expect(mockGetIdpLoginServerPartFromUrl).toHaveBeenCalledWith('someUrl');

			renderHook(() => useWebRedirectLogin('someOtherUrl', myWindow));
			receiveMessage(defaultEvent);

			expect(mockGetIdpLoginServerPartFromUrl).toHaveBeenCalledWith(
				'someOtherUrl'
			);
		});

		it('does not call onAuthUpdate if event.origin does not match what getIdpLoginServerPartFromUrl returns', () => {
			const event: MessageEvent = new MessageEvent('someType', {
				origin: 'https://someSuspiciousUrl/login',
				data: defaultAuthinfo,
			});

			renderHook(() => useWebRedirectLogin('someUrl', myWindow));
			receiveMessage(event);

			expect(mockOnAuthChange).not.toHaveBeenCalled();
		});
	});
});
