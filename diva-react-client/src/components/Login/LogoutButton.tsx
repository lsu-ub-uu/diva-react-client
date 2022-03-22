import React from 'react';
import Button from '../../styles/Button';
import useLogout from './useLogout';

const LogoutButton = function () {
	const { logout } = useLogout();
	return (
		<Button
			type="button"
			onClick={() => {
				logout();
			}}
		>
			Logout
		</Button>
	);
};

export default LogoutButton;
