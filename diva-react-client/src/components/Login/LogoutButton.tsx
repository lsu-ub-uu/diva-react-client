import { Box, Button } from 'grommet';
import { Logout } from 'grommet-icons';
import React from 'react';
import useLogout from './useLogout';

const LogoutButton = function () {
	const { logout } = useLogout();
	return (
		<Box align="center" pad="small">
			<Button
				icon={<Logout />}
				primary
				type="button"
				onClick={() => {
					logout();
				}}
				label="Logga ut"
				reverse
			/>
		</Box>
	);
};

export default LogoutButton;
