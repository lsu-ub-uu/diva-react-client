import React from 'react';
import { DropButton, Box } from 'grommet';
import LoginSelector from './LoginSelector';

const LoginButton = function () {
	const [open, setOpen] = React.useState<boolean>(false);

	const onOpen = () => {
		setOpen(true);
	};

	const onClose = () => {
		setOpen(false);
	};
	return (
		<Box align="center" pad="small">
			<DropButton
				primary
				label="Login"
				open={open}
				onOpen={onOpen}
				onClose={onClose}
				dropContent={<LoginSelector />}
				dropProps={{ align: { top: 'bottom' } }}
			/>
		</Box>
	);
};

export default LoginButton;
