import React from 'react';

enum LOGIN_STATUS {
	LOGGED_IN = 'logged_in',
	LOGGED_OUT = 'logged_out',
}

type Auth = {
	status: LOGIN_STATUS;
	token: string;
	idFromLogin: string;
	deleteUrl: string;
};

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

const AuthContext = React.createContext<ContextType | null>(null);

const AuthProvider = function ({ children }: { children: JSX.Element }) {
	const [auth, setAuth] = React.useState<Auth>({
		status: LOGIN_STATUS.LOGGED_OUT,
		token: '',
		idFromLogin: '',
		deleteUrl: '',
	});

	const value = React.useMemo((): ContextType => {
		return { auth, setAuth };
	}, [auth, setAuth]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = (): {
	value: Auth;
	onChange: (value: Auth) => void;
} => {
	const { auth, setAuth } = React.useContext(AuthContext) as ContextType;

	const handleAuth = (value: Auth) => {
		setAuth(value);
	};

	return { value: auth, onChange: handleAuth };
};

export { AuthProvider, useAuth, LOGIN_STATUS, Auth, AuthInfo };
