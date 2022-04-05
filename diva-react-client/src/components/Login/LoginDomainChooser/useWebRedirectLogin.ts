import { LOGIN_STATUS, useAuth } from '../../../context/AuthContext';
import { Auth, AuthInfo } from '../../../context/types';
import getIdpLoginServerPartFromUrl from './helpers';
import { window } from './window';

let urlToIdpLogin: string = '';
let openedWindow: Window | null;
let onAuthChange: (newAuth: Auth) => void;

const useWebRedirectLogin = () => {
	({ onAuthChange } = useAuth());

	return { startLoginProcess };
};
const startLoginProcess = (url: string) => {
	urlToIdpLogin = url;
	window.addEventListener('message', receiveMessage, false);

	openedWindow = window.open(urlToIdpLogin, 'DivaHelperWindow');
};

export const receiveMessage = (event: MessageEvent) => {
	const loginOrigin = getIdpLoginServerPartFromUrl(urlToIdpLogin);

	if (loginOrigin === event.origin && openedWindow === event.source) {
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
