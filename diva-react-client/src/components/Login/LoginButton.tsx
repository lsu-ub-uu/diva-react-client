import React from 'react';
import { DropButton, Box } from 'grommet';
import { Login } from 'grommet-icons';
import LoginDomainChooser from './LoginDomainChooser';

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
				icon={<Login />}
				reverse
				label="Logga in"
				open={open}
				onOpen={onOpen}
				onClose={onClose}
				dropContent={<LoginDomainChooser />}
				dropProps={{ align: { top: 'bottom' } }}
			/>
		</Box>
	);
};

export default LoginButton;
