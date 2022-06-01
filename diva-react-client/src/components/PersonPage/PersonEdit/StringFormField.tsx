import React from 'react';
import { MemoizedFormField } from './MemoizedFormField';

export const StringFormField = React.memo(
	({
		label,
		value,
		field,
		onChange,
		validate = undefined,
	}: {
		label: string;
		value: string;
		field: string;
		onChange: (field: string, value: string) => void;
		// eslint-disable-next-line react/require-default-props
		validate?: (value: string) => string | undefined;
	}) => {
		return (
			<MemoizedFormField
				name={field}
				label={label}
				value={value}
				onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
					onChange(field, event.target.value);
				}}
				validate={validate}
			/>
		);
	}
);

export default StringFormField;
