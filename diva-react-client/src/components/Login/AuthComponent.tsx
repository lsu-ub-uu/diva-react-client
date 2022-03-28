import React from 'react';
import { Box, Button, DropButton } from 'grommet';
import LogoutButton from './LogoutButton';
import { LOGIN_STATUS, useAuth } from '../../context/AuthContext';
import LoginSelector from './LoginSelector';

const LoginDropContent = function () {
	return (
		<Box pad="small">
			<LoginSelector />
			<Button label="Login" />
		</Box>
	);
};

const LoginButton = function () {
	const [open, setOpen] = React.useState<boolean>();
	const onOpen = () => {
		setOpen(true);
	};
	const onClose = () => {
		setOpen(false);
	};

	return (
		<Box align="center" pad="large">
			<DropButton
				label="Login"
				open={open}
				onOpen={onOpen}
				onClose={onClose}
				dropContent={<LoginDropContent />}
				dropProps={{ align: { top: 'bottom' } }}
			/>
		</Box>
	);
};

const AuthComponent = function () {
	const { auth } = useAuth();

	if (auth.status === LOGIN_STATUS.LOGGED_OUT) {
		return <LoginButton />;
	}
	return <LogoutButton />;
};

export default AuthComponent;
