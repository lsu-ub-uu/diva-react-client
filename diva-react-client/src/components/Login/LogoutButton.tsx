import { Box, Button } from 'grommet';
import React from 'react';
import useLogout from './useLogout';

const LogoutButton = function () {
	const { logout } = useLogout();
	return (
		<Box align="center" pad="small">
			<Button
				primary
				type="button"
				onClick={() => {
					logout();
				}}
				label="Logout"
			/>
		</Box>
	);
};

export default LogoutButton;
