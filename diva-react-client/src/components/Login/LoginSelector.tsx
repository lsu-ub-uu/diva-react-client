import { LoginUnitObject } from 'diva-cora-ts-api-wrapper';
import { Select } from 'grommet';
import React, { useState } from 'react';
import { getSortedLoginUnits } from '../../divaData/resources';
import { filterLoginUnits } from './helpers';
import useWebRedirectLogin from './useWebRedirectLogin';

const LoginSelector = function () {
	const { startLoginProcess } = useWebRedirectLogin();
	const allOptions = getSortedLoginUnits();
	const [options, setOptions] = useState(allOptions);

	const handleChange = ({ option }: { option: LoginUnitObject }) => {
		startLoginProcess(option.url);
	};

	const handleSearch = (text: string) => {
		const filteredOptions = filterLoginUnits(allOptions, text);
		setOptions(filteredOptions);
	};

	return (
		<Select
			options={options}
			size="medium"
			placeholder="Login"
			value={undefined}
			labelKey="displayTextSv"
			valueKey={{ key: 'displayTextSv' }}
			onChange={handleChange}
			onSearch={handleSearch}
		/>
	);
};

export default LoginSelector;
