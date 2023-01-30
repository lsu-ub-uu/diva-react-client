import React, { useState } from 'react';
import styled from 'styled-components';
import { Grid, Select /* TextInput */ } from 'grommet';
import SearchButton from './Buttons/SearchButton';
import SearchInput from './SearchInput/SearchInput';

const Form = styled.form`
	display: flex;
	flex-direction: column;
	/* grid-template-columns: 50% min-content;
	grid-template-rows: 1fr;
	justify-content: left;
	justify-items: left;
	column-gap: 1em;
	row-gap: 0.5em; */
	width: 50vw;
	gap: 0.5em;
	div {
		display: flex;
		grid-column: span 2;
	}
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
	// console.log(magnifyingGlass);
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

	const options = rowOptions.map((option) => {
		return option.toString();
	});

	if (!rowOptions.includes(opinionatedRows)) {
		options.push(opinionatedRows.toString());
	}
	return (
		<Form onSubmit={handleSubmit}>
			<div>
				<SearchInput
					value={value}
					onChange={handleChange}
				/>
				<SearchButton />
			</div>
			<div>
				<Grid
					columns={['6.3em', 'max-content']}
					gap={{ column: 'small' }}
					align='center'
				>
					<Select
						id='rows-input'
						aria-labelledby='rows-label'
						value={opinionatedRows.toString()}
						onChange={handleRowChange}
						options={options}
					/>
					<span id='rows-label'>Träffar per sida</span>
				</Grid>
			</div>
		</Form>
	);
};

export default SearchComponent;
