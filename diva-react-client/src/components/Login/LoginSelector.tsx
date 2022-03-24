import { LoginUnitObject } from 'diva-cora-ts-api-wrapper';
import { Select } from 'grommet';
import React from 'react';
import { getSortedLoginUnits } from '../../divaData/resources';
import useWebRedirectLogin from './useWebRedirectLogin';

const LoginSelector = function () {
	const { startLoginProcess } = useWebRedirectLogin();
	const defaultOptions = getSortedLoginUnits();

	type EventType = {
		option: LoginUnitObject;
	};
	const handleChange = (event: EventType) => {
		startLoginProcess(event.option.url);
	};
	return (
		<Select
			options={defaultOptions}
			size="medium"
			placeholder="Login"
			value={undefined}
			labelKey="displayTextSv"
			valueKey={{ key: 'displayTextSv' }}
			onChange={handleChange}
			onSearch={(text) => {
				// The line below escapes regular expression special characters:
				// [ \ ^ $ . | ? * + ( )
				const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');

				// Create the regular expression with modified value which
				// handles escaping special characters. Without escaping special
				// characters, errors will appear in the console
				const exp = new RegExp(escapedText, 'i');
				defaultOptions.filter((o) => exp.test(o.displayTextSv));
				// setOptions();
			}}
		/>
	);
};

export default LoginSelector;

// import { LoginUnitObject } from 'diva-cora-ts-api-wrapper';
// import { Select } from 'grommet';
// import React, { useState } from 'react';
// import { getSortedLoginUnits } from '../../divaData/resources';
// import useWebRedirectLogin from './useWebRedirectLogin';

// const LoginSelector = function () {
// 	const defaultOptions = getSortedLoginUnits();
// 	const { startLoginProcess } = useWebRedirectLogin();
// 	const [options, setOptions] = useState(defaultOptions);

// 	type EventType = {
// 		option: LoginUnitObject;
// 	};
// 	const handleChange = (event: EventType) => {
// 		startLoginProcess(event.option.url);
// 	};

// 	return (
// 		<Select
// 			size="medium"
// 			placeholder="Login"
// 			value={undefined}
// 			options={options}
// 			labelKey="displayTextSv"
// 			valueKey={{ key: 'displayTextSv' }}
// 			onChange={handleChange}
// 			// onClose={() => setOptions(defaultOptions)}
// 			onSearch={(text) => {
// 				// The line below escapes regular expression special characters:
// 				// [ \ ^ $ . | ? * + ( )
// 				const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');

// 				// Create the regular expression with modified value which
// 				// handles escaping special characters. Without escaping special
// 				// characters, errors will appear in the console
// 				const exp = new RegExp(escapedText, 'i');
// 				setOptions(defaultOptions.filter((o) => exp.test(o.displayTextSv)));
// 			}}
// 		/>
// 	);
// };

// export default LoginSelector;
