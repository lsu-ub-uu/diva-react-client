import React, { useEffect } from 'react';
import { LOGIN_STATUS, useAuth } from '../context/AuthContext';

const FakeLogin = function () {
	const { onAuthChange } = useAuth();

	useEffect(() => {
		onAuthChange({
			deleteUrl: 'someUrl',
			domain: 'uu',
			idFromLogin: 'someId@somedomain.tld',
			status: LOGIN_STATUS.LOGGED_IN,
			token: '23fe8b2e-5359-4804-be24-53b5a5ea334e',
		});
	}, []);

	return <div />;
};

export default FakeLogin;
