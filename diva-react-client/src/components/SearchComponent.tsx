import React, { useState } from 'react';
import styled from 'styled-components';
import { Button as GrommetButton, Grid, Select, TextInput } from 'grommet';
import { Search } from 'grommet-icons';

const StyledForm = styled.form`
	display: grid;
	grid-template-columns: 50% min-content;
	grid-template-rows: 1fr;
	justify-content: left;
	justify-items: left;
	column-gap: 1em;
	row-gap: 0.5em;
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

	const options = rowOptions.map((option) => {
		return option.toString();
	});

	if (!rowOptions.includes(opinionatedRows)) {
		options.push(opinionatedRows.toString());
	}
	return (
		<StyledForm onSubmit={handleSubmit}>
			<TextInput
				type='search'
				icon={<Search />}
				reverse
				placeholder='Sök med namn, ORCID eller id'
				value={value}
				onChange={handleChange}
				aria-labelledby='searchButton'
			/>
			<GrommetButton
				type='submit'
				id='searchButton'
				primary
				label='Sök'
			/>
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
		</StyledForm>
	);
};

export default SearchComponent;
