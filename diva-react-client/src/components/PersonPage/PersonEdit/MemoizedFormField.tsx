/* eslint-disable react/require-default-props */
import React from 'react';
import { FormField, TextAreaExtendedProps } from 'grommet';

export const MemoizedFormField = React.memo(
	({
		label,
		required = false,
		disabled = false,
		value,
		onChange = undefined,
		name = undefined,
		validate = undefined,
		component = undefined,
	}: {
		label: string;
		required?: boolean;
		disabled?: boolean;
		value: string;
		onChange?: React.ChangeEventHandler<HTMLInputElement> &
			((event: React.ChangeEvent<HTMLInputElement>) => void);
		name?: string;
		validate?: (value: string) => string | undefined;
		component?: React.FC<TextAreaExtendedProps>;
	}) => {
		return (
			<FormField
				label={label}
				name={name}
				required={required}
				value={value}
				onChange={onChange}
				validate={validate}
				component={component}
				disabled={disabled}
			/>
		);
	}
);

export default MemoizedFormField;
