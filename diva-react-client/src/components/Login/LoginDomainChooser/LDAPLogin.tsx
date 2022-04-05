import {
	Box,
	Button,
	Form,
	FormExtendedEvent,
	FormField,
	TextInput,
} from 'grommet';
import React from 'react';

const LDAPLogin = function () {
	const [value, setValue] = React.useState({ username: '', password: '' });

	const submitButtonIsDisabled = React.useCallback(() => {
		const { username, password } = value;
		return !(username !== '' && password !== '');
	}, [value]);

	const onSubmit = (
		event: FormExtendedEvent<{ username: string; password: string }, Element>
	) => {
		console.log(event.value);
	};

	return (
		<Form
			value={value}
			onChange={(nextValue) => setValue(nextValue)}
			onSubmit={onSubmit}
		>
			<FormField name="username" htmlFor="username">
				<TextInput name="username" id="username" placeholder="Användarnamn" />
			</FormField>
			<FormField name="password" htmlFor="password">
				<TextInput name="password" type="password" placeholder="Lösenord" />
			</FormField>
			<Box direction="row">
				<Button
					label="Logga in på organisation"
					type="submit"
					primary
					disabled={submitButtonIsDisabled()}
				/>
			</Box>
		</Form>
	);
};

export default LDAPLogin;
