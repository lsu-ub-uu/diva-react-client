import { LoginUnitObject } from 'diva-cora-ts-api-wrapper';
import { Box, Button, Grid, Select } from 'grommet';
import React, { useState } from 'react';
import { getSortedLoginUnits } from '../../divaData/resources';
import { filterLoginUnits } from './helpers';
import useWebRedirectLogin from './useWebRedirectLogin';

const LoginSelector = function () {
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
			</Grid>
		</Box>
	);
};

export default LoginSelector;
