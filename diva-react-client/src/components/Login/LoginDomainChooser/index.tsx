import { LoginType, LoginUnitObject } from 'diva-cora-ts-api-wrapper';
import { Box, Grid, Select } from 'grommet';
import React, { useState } from 'react';
import { getSortedLoginUnits } from '../../../divaData/resources';
import { filterLoginUnits } from './helpers';
import LDAPLogin from './LDAPLogin';
import WebRedirectLogin from './WebRedirectLogin';

const LoginDomainChooser = function () {
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
		return <WebRedirectLogin value={value} />;
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
