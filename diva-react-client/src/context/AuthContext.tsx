import React from 'react';
import { Auth, ContextType } from './types';

enum LOGIN_STATUS {
	LOGGED_IN = 'logged_in',
	LOGGED_OUT = 'logged_out',
}

const AuthProvider = function ({ children }: { children: JSX.Element }) {
	const [auth, setAuth] = React.useState<Auth>({
		status: LOGIN_STATUS.LOGGED_OUT,
		token: '',
		idFromLogin: '',
		deleteUrl: '',
		domain: '',
	});

	const value = React.useMemo((): ContextType => {
		return { auth, setAuth };
	}, [auth, setAuth]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const AuthContext = React.createContext<ContextType>({
	auth: {
		deleteUrl: '',
		idFromLogin: '',
		status: LOGIN_STATUS.LOGGED_OUT,
		token: '',
		domain: '',
	},
	setAuth: () => {
		throw new Error('useAuth can only be used within a child of AuthProvider.');
	},
});

const useAuth = () => {
	const { auth, setAuth } = React.useContext(AuthContext);
	return {
		auth,
		onAuthChange: (newAuth: Auth) => {
			setAuth(newAuth);
		},
	};
};

export { AuthProvider, useAuth, LOGIN_STATUS };
