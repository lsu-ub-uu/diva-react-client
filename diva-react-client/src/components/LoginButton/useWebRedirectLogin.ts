import { LOGIN_STATUS, useAuth } from '../../context/AuthContext';
import { Auth, AuthInfo } from '../../context/types';
import getIdpLoginServerPartFromUrl from './helpers';

type InterestingWindow = {
	addEventListener: (
		message: string,
		callBack: (event: MessageEvent) => void,
		someBool: boolean
	) => void;
	open: (url: string, name: string) => Window | null;
};

let internalUrl: string;
let myWindow: InterestingWindow;
let onAuthChange: (newAuth: Auth) => void;

const useWebRedirectLogin = (url: string, window: InterestingWindow) => {
	internalUrl = url;
	myWindow = window;
	({ onAuthChange } = useAuth());

	return { startLoginProcess };
};

const startLoginProcess = () => {
	myWindow.addEventListener('message', receiveMessage, false);

	myWindow.open(internalUrl, 'DivaHelperWindow');
};

export const receiveMessage = (event: MessageEvent) => {
	const loginOrigin = getIdpLoginServerPartFromUrl(internalUrl);

	if (loginOrigin === event.origin) {
		const authInfo = event.data as AuthInfo;

		onAuthChange({
			status: LOGIN_STATUS.LOGGED_IN,
			token: authInfo.token,
			idFromLogin: authInfo.idFromLogin,
			deleteUrl: authInfo.actionLinks.delete.url,
		});
	}
};

export default useWebRedirectLogin;
