import { LoginType, LoginUnitObject } from 'diva-cora-ts-api-wrapper';
import { Box, Button, Grid, Select } from 'grommet';
import React, { useState } from 'react';
import { getSortedLoginUnits } from '../../../divaData/resources';
import { filterLoginUnits } from './helpers';
import LDAPLogin from './LDAPLogin';
import useWebRedirectLogin from './useWebRedirectLogin';

const LoginDomainChooser = function () {
	const { startLoginProcess } = useWebRedirectLogin();
	const allOptions = getSortedLoginUnits();
	const [options, setOptions] = useState(allOptions);
	const [value, setValue] = useState<LoginUnitObject | undefined>(undefined);

	const handleChange = ({ value: newValue }: { value: LoginUnitObject }) => {
		setValue(newValue);
	};

	const handleSearch = (text: string) => {
		const filteredOptions = filterLoginUnits(allOptions, text);
		setOptions(filteredOptions);
	};

	const possiblyDisplayLDAPLogin = () => {
		if (value !== undefined && value.type === LoginType.LoginLDAP) {
			return <LDAPLogin />;
		}
		return (
			<Box direction="row">
				<Button
					label="Logga in på organisation"
					primary
					disabled={!value}
					onClick={() => {
						if (value) {
							startLoginProcess(value.url);
						}
					}}
				/>
			</Box>
		);
	};

	return (
		<Box pad="small">
			<Grid gap="small">
				<Select
					options={options}
					size="medium"
					placeholder="Välj organisation"
					value={value}
					labelKey="displayTextSv"
					valueKey={{ key: 'displayTextSv' }}
					onChange={handleChange}
					onSearch={handleSearch}
				/>
				{possiblyDisplayLDAPLogin()}
			</Grid>
		</Box>
	);
};

export default LoginDomainChooser;
