import React from 'react';
import LogoutButton from './LogoutButton';
import { LOGIN_STATUS, useAuth } from '../../context/AuthContext';
import LoginSelector from './LoginSelector';

const AuthComponent = function () {
	const { auth } = useAuth();

	if (auth.status === LOGIN_STATUS.LOGGED_OUT) {
		return <LoginSelector />;
	}
	return <LogoutButton />;
};

export default AuthComponent;
