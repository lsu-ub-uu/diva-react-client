import React from 'react';

type Auth = {
	status: LOGIN_STATUS;
	token: string;
};

enum LOGIN_STATUS {
	LOGGED_IN = 'logged_in',
	LOGGED_OUT = 'logged_out',
}
type ContextType = {
	auth: Auth;
	setAuth: React.Dispatch<React.SetStateAction<Auth>>;
};

const AuthContext = React.createContext<ContextType | null>(null);

const AuthProvider = function ({ children }: { children: JSX.Element }) {
	const [auth, setAuth] = React.useState<Auth>({
		status: LOGIN_STATUS.LOGGED_OUT,
		token: '',
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

export { AuthProvider, useAuth, LOGIN_STATUS };
