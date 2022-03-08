import React from 'react';

type Auth = {
	status: LOGIN_STATUS;
	token: string;
};

export enum LOGIN_STATUS {
	LOGGED_IN = 'logged_in',
	LOGGED_OUT = 'logged_out',
}

const AuthContext = React.createContext<Auth>({
	status: LOGIN_STATUS.LOGGED_OUT,
	token: '',
});

export default AuthContext;
