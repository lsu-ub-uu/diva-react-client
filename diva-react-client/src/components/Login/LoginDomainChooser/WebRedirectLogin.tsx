import { LoginUnitObject } from 'diva-cora-ts-api-wrapper';
import { Box, Button } from 'grommet';
import React from 'react';
import useWebRedirectLogin from './useWebRedirectLogin';

const WebRedirectLogin = function ({
	value,
}: {
	value: LoginUnitObject | undefined;
}) {
	const { startLoginProcess } = useWebRedirectLogin();

	return (
		<Box direction='row'>
			<Button
				label='Logga in på organisation'
				primary
				disabled={!value}
				onClick={() => {
					if (value) {
						const { url } = value;
						startLoginProcess(url);
					}
				}}
			/>
		</Box>
	);
};

export default WebRedirectLogin;
