import React from 'react';
import { LOGIN_STATUS } from './AuthContext';

type ContextType = {
	auth: Auth;
	setAuth: React.Dispatch<React.SetStateAction<Auth>>;
};

type AuthInfo = {
	actionLinks: { delete: { url: string } };
	idFromLogin: string;
	token: string;
	userId: string;
	validForNoSeconds: string;
};

type Auth = {
	status: LOGIN_STATUS;
	token: string;
	idFromLogin: string;
	deleteUrl: string;
	domain: string;
};

export { Auth, ContextType, AuthInfo };
