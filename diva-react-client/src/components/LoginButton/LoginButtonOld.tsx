import React from 'react';
import { useAuth, LOGIN_STATUS, Auth, AuthInfo } from '../context/AuthContext';
import Button from '../styles/Button';
import useWebRedirectLogin from './useWebRedirectLogin';

let onChange: (value: Auth) => void;
let value: Auth;

const LoginButton = function () {
	({ value, onChange } = useAuth());

	return (
		<Button onClick={handleClick}>
			{value.status === LOGIN_STATUS.LOGGED_OUT ? 'Login' : 'Logout'}
		</Button>
	);
};

const url = 'http://127.0.0.1:8080/webredirect.html';

let loginOrigin: string;
let openedWindow: Window | null;

const handleClick = () => {
	if (value.status === LOGIN_STATUS.LOGGED_OUT) {
		useWebRedirectLogin(url);

		window.addEventListener('message', receiveMessage, false);

		openedWindow = window.open(url, 'DivaHelperWindow');
	} else {
		logout();
	}
};

const logout = async () => {
	try {
		const result = await fetch(value.deleteUrl, {
			credentials: 'include',
			headers: {
				authToken: value.token,
			},
			body: value.token,
			method: 'DELETE',
		});
		if (result.status === 200) {
			onChange({
				status: LOGIN_STATUS.LOGGED_OUT,
				token: '',
				deleteUrl: '',
				idFromLogin: '',
			});
		}
	} catch (error) {
		console.log('does not work locally');
		onChange({
			status: LOGIN_STATUS.LOGGED_OUT,
			token: '',
			deleteUrl: '',
			idFromLogin: '',
		});
	}
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
		idFromLogin: authInfo.idFromLogin,
		deleteUrl: authInfo.actionLinks.delete.url,
	});

	console.log(authInfo.token);
}

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
