/* eslint-disable react/require-default-props */
import React from 'react';
import { FormField, TextArea, TextInput } from 'grommet';

export const MemoizedTextField = React.memo(
	({
		label,
		required = false,
		disabled = false,
		value,
		onChange = undefined,
		name = undefined,
		validate = undefined,
	}: {
		label: string;
		required?: boolean;
		disabled?: boolean;
		value: string;
		onChange?: React.ChangeEventHandler<HTMLInputElement> &
			((event: React.ChangeEvent<HTMLInputElement>) => void);
		name?: string;
		validate?: (value: string) => string | undefined;
	}) => {
		return (
			<FormField
				label={label}
				name={name}
				required={required}
				validate={validate}
				disabled={disabled}
			>
				<TextInput value={value} onChange={onChange} />
			</FormField>
		);
	}
);

export const MemoizedTextArea = React.memo(
	({
		label,
		required = false,
		disabled = false,
		value,
		onChange = undefined,
		name = undefined,
		validate = undefined,
	}: {
		label: string;
		required?: boolean;
		disabled?: boolean;
		value: string;
		onChange?: React.ChangeEventHandler<HTMLInputElement> &
			((event: React.ChangeEvent<HTMLInputElement>) => void);
		name?: string;
		validate?: (value: string) => string | undefined;
	}) => {
		return (
			<FormField
				label={label}
				name={name}
				required={required}
				validate={validate}
				disabled={disabled}
				onChange={onChange}
			>
				<TextArea value={value} />
			</FormField>
		);
	}
);

export default MemoizedTextField;
