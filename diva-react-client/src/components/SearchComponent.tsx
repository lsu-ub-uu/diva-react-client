import React, { useState } from 'react';
import styled from 'styled-components';
// import { Grid, Select /* TextInput */ } from 'grommet';
import Form from '../styles/Form';
import SearchButton from './Buttons/SearchButton';
import SearchInput from './Input/SearchInput';
import Select from './Input/Select';

function getRowsOrDefaultValue(providedRows: number) {
	return providedRows < 1 ? 50 : providedRows;
}
const Flex = styled.div`
	display: flex;
	align-items: center;
`;
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
			<Flex>
				<Select
					id='rows-input'
					value={opinionatedRows.toString()}
					onChange={handleRowChange}
					options={options}
					labelText='Träffar per sida'
				/>
			</Flex>
		</Form>
	);
};

export default SearchComponent;
