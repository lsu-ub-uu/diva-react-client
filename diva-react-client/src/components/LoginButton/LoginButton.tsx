import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../styles/Button';
import useWebRedirectLogin from './useWebRedirectLogin';

const url = 'http://127.0.0.1:8080/webredirect.html';

const LoginButton = function () {
	const { auth } = useAuth();
	const { startLoginProcess } = useWebRedirectLogin(url, window);

	console.log(auth);

	return (
		<Button
			onClick={() => {
				startLoginProcess();
			}}
		>
			Login
		</Button>
	);
};

export default LoginButton;
