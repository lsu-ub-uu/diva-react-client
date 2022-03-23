import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { getLoginUnits } from '../../divaData/resources';
import Button from '../../styles/Button';
import useWebRedirectLogin from './useWebRedirectLogin';

const url =
	'https://www.diva-portal.org/Shibboleth.sso/Login/uu?target=https://www.diva-portal.org/diva-test/idplogin/login';

const LoginButton = function () {
	const { auth } = useAuth();
	const { startLoginProcess } = useWebRedirectLogin(url);

	console.log(auth);
	console.log(getLoginUnits());

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
