import React, { useState } from 'react';
import SelectSearch, {
	SelectedOption,
	SelectedOptionValue,
	SelectSearchOption,
	SelectSearchProps,
} from 'react-select-search';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import { LOGIN_STATUS, useAuth } from '../../context/AuthContext';
import './select-search.css';
import { getLoginUnits } from '../../divaData/resources';

const AuthComponent = function () {
	const { auth } = useAuth();
	const [chosenLoginUnit, setChosenLoginUnit] = useState<string>('-1');

	const loginUnits = getLoginUnits();

	const options: SelectSearchOption[] = loginUnits.map((loginUnit, index) => {
		return {
			name: loginUnit.displayTextSv,
			value: index,
		};
	});

	// const options: SelectSearchOption[] = [
	// 	{ name: 'Swedish', value: 'sv' },
	// 	{ name: 'English', value: 'en' },
	// 	{ name: 'German', value: 'de' },
	// 	{ name: 'Spanish', value: 'es' },
	// ];
	// if (auth.status === LOGIN_STATUS.LOGGED_OUT) {
	// 	return <LoginButton />;
	// }
	// return <LogoutButton />;

	const handleChange = (
		selectedValue: SelectedOptionValue | SelectedOptionValue[],
		selectedOption: SelectedOption | SelectedOption[],
		optionSnapshot: SelectSearchProps
	) => {
		const option = selectedOption as unknown as SelectedOptionValue;

		// console.log(selectedValue);
		console.log(option.name);
		setChosenLoginUnit(option.name);
	};
	return (
		<SelectSearch
			options={options}
			search
			value={chosenLoginUnit}
			onChange={handleChange}
			filterOptions={(optionList) => {
				return (value) => {
					if (!value.length) {
						return options;
					}

					return optionList.filter((option) => {
						const name = option.name.toLowerCase();
						return name.includes(value.toLowerCase());
					});
				};
			}}
			placeholder="Login"
		/>
	);
};

export default AuthComponent;
