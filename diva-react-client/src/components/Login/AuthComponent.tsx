import React from 'react';
import LogoutButton from './LogoutButton';
import { LOGIN_STATUS, useAuth } from '../../context/AuthContext';
import LoginButton from './LoginButton';

const AuthComponent = function () {
	const { auth } = useAuth();

	if (auth.status === LOGIN_STATUS.LOGGED_OUT) {
		return <LoginButton />;
	}
	return <LogoutButton />;
};

export default AuthComponent;
