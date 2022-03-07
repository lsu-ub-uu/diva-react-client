import React from 'react';
import Button from '../styles/Button';

const LoginButton = function () {
	return <Button onClick={handleClick}>Login</Button>;
};

const url =
	'https://www.diva-portal.org/Shibboleth.sso/Login/uu?target=https://www.diva-portal.org/diva-test/idplogin/login';

// const url = 'https://www.uu.se';
let loginOrigin: string;
let openedWindow: Window | null;

const handleClick = () => {
	window.addEventListener('message', receiveMessage, false);

	openedWindow = window.open('popup.html', 'CoraHelperWindow');
};

function receiveMessage(event: MessageEvent) {
	console.log(event);
	// if (messageIsFromWindowOpenedFromHere(event)) {
	// 	handleMessagesFromOkSender(event.data);
	// }
}

function handleMessagesFromOkSender(data: any) {
	// appTokenAuthInfoCallback(data);
	console.log(data);
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
