import React, { useState } from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { Button as GrommetButton } from 'grommet';

import Button from '../styles/Button';
import Select from '../styles/Select';

const SearchInput = styled.input`
	width: 100%;
	font-size: 1em;
	height: 40px;
	padding: 0 10px;
	border: 0;
	border-radius: 3px;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4) inset;
	background-color: ${(props: { theme: DefaultTheme }) =>
		props.theme.secondary};
`;

const StyledForm = styled.form`
	display: grid;
	grid-template-columns: 50% min-content;
	grid-template-rows: 1fr;
	justify-content: left;
	justify-items: left;
	column-gap: 1em;
	row-gap: 0.5em;
`;

const StyledLabel = styled.label`
	display: grid;
	grid-template-columns: auto auto;
	grid-template-rows: 1fr;
	align-items: center;
	column-gap: 0.5em;
`;

function getRowsOrDefaultValue(providedRows: number) {
	return providedRows < 1 ? 50 : providedRows;
}

const SearchComponent = function ({
	value,
	rows,
	rowOptions,
	onValueChange,
	onRowUpdate,
	onSubmit,
}: {
	value: string;
	rows: number;
	rowOptions: number[];
	onValueChange: (newValue: string) => void;
	onRowUpdate: (newRows: number) => void;
	onSubmit: () => void;
}) {
	const [opinionatedRows, setOpinionatedRows] = useState(
		getRowsOrDefaultValue(rows)
	);

	React.useEffect(() => {
		const newRowOption = getRowsOrDefaultValue(rows);
		setOpinionatedRows(newRowOption);
	}, [rows]);

	const handleChange = React.useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			onValueChange(event.target.value);
		},
		[onValueChange]
	);

	const handleSubmit = React.useCallback(
		(event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			onSubmit();
		},
		[onSubmit]
	);

	const handleRowChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const newRows = parseInt(event.target.value, 10);
		setOpinionatedRows(newRows);
		onRowUpdate(newRows);
	};
	return (
		<StyledForm onSubmit={handleSubmit}>
			<SearchInput
				type="search"
				aria-labelledby="searchButton"
				minLength={1}
				maxLength={100}
				value={value}
				onChange={handleChange}
			/>
			<GrommetButton
				type="submit"
				id="searchButton"
				primary
				label="Sök"
				color="primary"
			/>
			<StyledLabel id="rows-label" htmlFor="rows-input">
				<Select
					id="rows-input"
					aria-labelledby="rows-label"
					value={opinionatedRows}
					onChange={handleRowChange}
				>
					{rowOptions.map((option) => {
						return (
							<option key={option} value={option.toString()}>
								{option.toString()}
							</option>
						);
					})}
					{!rowOptions.includes(opinionatedRows) && (
						<option key={opinionatedRows} value={opinionatedRows.toString()}>
							{opinionatedRows.toString()}
						</option>
					)}
				</Select>
				<div>Träffar per sida</div>
			</StyledLabel>
		</StyledForm>
	);
};

export default SearchComponent;
