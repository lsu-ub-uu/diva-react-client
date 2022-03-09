import React from 'react';
import { useAuth, LOGIN_STATUS } from '../context/AuthContext';
import Button from '../styles/Button';

let onChange: (value: any) => void;

const LoginButton = function () {
	({ onChange } = useAuth());

	return <Button onClick={handleClick}>Login</Button>;
};

const url = 'http://127.0.0.1:8080/webredirect.html';

// const url =
// 	'https://www.diva-portal.org/Shibboleth.sso/Login/uu?target=https://www.diva-portal.org/diva-test/idplogin/login';

let loginOrigin: string;
let openedWindow: Window | null;

const handleClick = () => {
	window.addEventListener('message', receiveMessage, false);

	openedWindow = window.open(url, 'CoraHelperWindow');
};

function receiveMessage(event: MessageEvent) {
	if (messageIsFromWindowOpenedFromHere(event)) {
		handleMessagesFromOkSender(event.data);
	}
	handleMessagesFromOkSender(event.data);
}

function handleMessagesFromOkSender(data: any) {
	const authInfo = data as AuthInfo;

	onChange({
		status: LOGIN_STATUS.LOGGED_IN,
		token: authInfo.token,
	});

	console.log(authInfo.token);
}

type AuthInfo = {
	actionLinks: Object;
	idFromLogin: string;
	token: string;
	userId: string;
	validForNoSeconds: string;
};

function messageIsFromWindowOpenedFromHere(event: MessageEvent) {
	loginOrigin = getIdpLoginServerPartFromUrl(url);

	return loginOrigin === event.origin && openedWindow === event.source;
}

function getIdpLoginServerPartFromUrl(urlToWedredirectLogin: string) {
	const targetPart = urlToWedredirectLogin.substring(
		urlToWedredirectLogin.indexOf('target=') + 7
	);
	const lengthOfHttps = 'https://'.length;
	return targetPart.substring(0, targetPart.indexOf('/', lengthOfHttps));
}

export default LoginButton;
