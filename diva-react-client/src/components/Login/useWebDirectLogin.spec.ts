import { renderHook } from '@testing-library/react-hooks/dom';
import { LOGIN_STATUS, useAuth } from '../../context/AuthContext';
import getIdpLoginServerPartFromUrl from './helpers';
import useWebRedirectLogin, { receiveMessage } from './useWebRedirectLogin';
import { window } from './window';

jest.mock('./helpers');
const mockGetIdpLoginServerPartFromUrl =
	getIdpLoginServerPartFromUrl as jest.MockedFunction<
		typeof getIdpLoginServerPartFromUrl
	>;

jest.mock('./window', () => ({
	window: {
		addEventListener: jest.fn(),
		open: jest.fn(() => {
			return returnedWindow;
		}),
	},
}));

jest.mock('../../context/AuthContext');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

let returnedWindow = window as jest.Mocked<typeof window>;

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

	mockGetIdpLoginServerPartFromUrl.mockReturnValue('https://someUrl/login');
});

describe('useWebDirectLogin.spec', () => {
	it('takes no arguments', () => {
		renderHook(() => useWebRedirectLogin());
	});

	it('calls useAuth', () => {
		renderHook(() => useWebRedirectLogin());

		expect(mockUseAuth).toHaveBeenCalledTimes(1);
	});

	it('returns function startLoginProcess', () => {
		const { result } = renderHook(() => useWebRedirectLogin());

		expect(result.current.startLoginProcess).toBeDefined();
	});

	it('calling startLoginProcess calls window.addEventListener', () => {
		const { result } = renderHook(() => useWebRedirectLogin());

		result.current.startLoginProcess('someUrl');

		expect(window.addEventListener).toHaveBeenCalledWith(
			'message',
			receiveMessage,
			false
		);
	});

	it('calling startLoginProcess calls window.open', () => {
		const { result } = renderHook(() => useWebRedirectLogin());

		result.current.startLoginProcess('someUrl');

		expect(window.open).toHaveBeenCalledWith('someUrl', 'DivaHelperWindow');

		// const { result: result2 } = renderHook(() =>
		// 	useWebRedirectLogin('someOtherUrl')
		// );

		result.current.startLoginProcess('someOtherUrl');

		expect(window.open).toHaveBeenCalledWith(
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
		source: returnedWindow,
	});

	describe('receiveMessage', () => {
		it('takes a MessageEvent', () => {
			renderHook(() => useWebRedirectLogin());
			receiveMessage(defaultEvent);
		});

		it('calls onAuthUpdate with data', () => {
			renderHook(() => useWebRedirectLogin());
			receiveMessage(defaultEvent);

			expect(mockOnAuthChange).toHaveBeenCalledWith({
				status: LOGIN_STATUS.LOGGED_IN,
				token: defaultAuthinfo.token,
				idFromLogin: defaultAuthinfo.idFromLogin,
				deleteUrl: defaultAuthinfo.actionLinks.delete.url,
			});
		});

		it('calls getIdpLoginServerPartFromUrl with url', () => {
			const { result } = renderHook(() => useWebRedirectLogin());
			result.current.startLoginProcess('someUrl');
			receiveMessage(defaultEvent);

			expect(mockGetIdpLoginServerPartFromUrl).toHaveBeenLastCalledWith(
				'someUrl'
			);

			result.current.startLoginProcess('someOtherUrl');
			receiveMessage(defaultEvent);

			expect(mockGetIdpLoginServerPartFromUrl).toHaveBeenLastCalledWith(
				'someOtherUrl'
			);
		});

		it('does not call onAuthUpdate if event.origin does not match what getIdpLoginServerPartFromUrl returns', () => {
			const event: MessageEvent = new MessageEvent('someType', {
				origin: 'https://someSuspiciousUrl/login',
				data: defaultAuthinfo,
				source: returnedWindow,
			});

			renderHook(() => useWebRedirectLogin());
			receiveMessage(event);

			expect(mockOnAuthChange).not.toHaveBeenCalled();
		});

		it('does not call onAuthUpdate if event.source does not equal the previously opened window', () => {
			const event: MessageEvent = new MessageEvent('someType', {
				origin: 'https://someUrl/login',
				data: defaultAuthinfo,
			});

			renderHook(() => useWebRedirectLogin());
			receiveMessage(event);

			expect(mockOnAuthChange).not.toHaveBeenCalled();
		});
	});
});
