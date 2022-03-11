import React from 'react';
import LoginButton from './LoginButton';
import { LOGIN_STATUS, useAuth } from '../../context/AuthContext';

const AuthComponent = function () {
	const { auth } = useAuth();
	if (auth.status === LOGIN_STATUS.LOGGED_OUT) {
		return <LoginButton />;
	}
	return <div />;
};

export default AuthComponent;
