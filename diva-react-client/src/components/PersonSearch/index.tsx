import React from 'react';
import styled from 'styled-components';
import SearchComponent from '../SearchComponent';
import PaginatedCardList from './PaginatedCardList';
import usePersonSearchParams from './usePersonSearchParams';
import useSearchPersonsByNameSearch from './useSearchPersonsByNameSearch';

const Parent = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: auto;
	row-gap: 1em;
`;

const DEFAULT_ROW_OPTIONS = [10, 25, 50, 100];

const PersonSearch = function () {
	const { searchTerm, start, rows, setSearchTerm, setStart, setRows } =
		usePersonSearchParams();

	const { isLoading, result, triggerSearchWithParams } =
		useSearchPersonsByNameSearch(searchTerm, start, rows);

	const handleValueChange = (newValue: string) => {
		setSearchTerm(newValue);
	};

	const onSubmit = () => {
		const newStart = 1;
		setStart(newStart);
		triggerSearchWithParams(searchTerm, newStart, rows);
	};

	const onRowUpdate = (newRows: number) => {
		setRows(newRows);
		triggerSearchWithParams(searchTerm, start, newRows);
	};

	const onPaginationUpdate = (newStart: number) => {
		setStart(newStart);
		triggerSearchWithParams(searchTerm, newStart, rows);
	};

	return (
		<Parent>
			<h1>Personsök</h1>
			<SearchComponent
				rows={rows}
				rowOptions={DEFAULT_ROW_OPTIONS}
				onRowUpdate={onRowUpdate}
				value={searchTerm}
				onSubmit={onSubmit}
				onValueChange={handleValueChange}
			/>
			{result.data && (
				<PaginatedCardList
					list={result.data}
					rows={rows}
					onPaginationUpdate={onPaginationUpdate}
				/>
			)}
			{isLoading && <div>Laddar...</div>}
			{result.error && (
				<div>Ett fel har inträffat: &quot;{result.error.message}&quot;</div>
			)}
		</Parent>
	);
};

export default PersonSearch;
