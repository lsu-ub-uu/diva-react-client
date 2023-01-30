import React, { useState } from 'react';
import styled from 'styled-components';
import { Grid, Select /* TextInput */ } from 'grommet';
import SearchButton from './Buttons/SearchButton';
// import magnifyingGlass from './SearchInput/magnifying-glass.svg';

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
const SearchInput = styled.input`
	box-sizing: border-box;
	border-top-left-radius: 4px;
	border-bottom-left-radius: 4px;
	color: rgb(0, 0, 0);
	cursor: pointer;
	display: inline-block;
	padding: 0.5em 2.4em;
	text-align: left;
	border: 1px solid #999;
	font-size: 1em;
	height: 2.5em;
	background-image: url('/img/logo/magnifying-glass.svg');
	background-size: 32px;
	background-repeat: no-repeat;
	background-position-x: 0.4em;
	background-position-y: 50%;
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
					id='search'
					type='search'
					/* icon={<Search />}
					reverse */
					placeholder='Sök med namn, ORCID eller id'
					value={value}
					onChange={handleChange}
					aria-labelledby='searchButton'
				/>
				{/* <GrommetButton
				type='submit'
				id='searchButton'
				primary
				label='Sök'
			/> */}
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
