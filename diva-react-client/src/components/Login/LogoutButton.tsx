import { Button } from 'grommet';
import React from 'react';
import useLogout from './useLogout';

const LogoutButton = function () {
	const { logout } = useLogout();
	return (
		<Button
			type="button"
			onClick={() => {
				logout();
			}}
			label="Logout"
		/>
	);
};

export default LogoutButton;
