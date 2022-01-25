import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PaginatedCardList from '../PaginatedCardList';
import SearchComponent from '../SearchComponent';
import useRowsWithString from './useRowsWithString';
import useSearchPersonsByNameSearch from './useSearchPersonsByNameSearch';
import useStartWithString from './useStartWithString';

const DEFAULT_ROW_OPTIONS = [10, 25, 50, 100];
const MAX_ROWS = 100;
const DEFAULT_ROWS = 10;

const PersonSearch = function () {
	const [searchParams, setSearchParams] = useSearchParams();
	const searchTerm = searchParams.get('searchTerm') || '';
	const startFromSearchParams = searchParams.get('start') || '1';
	const { start: initialStart } = useStartWithString(startFromSearchParams);

	const rowsString = searchParams.get('rows') || '';
	const { rows: initialRows } = useRowsWithString(
		rowsString,
		MAX_ROWS,
		DEFAULT_ROWS
	);

	const [apiSearchTerm, setApiSearchTerm] = useState(searchTerm);
	// const initialStart = parseInt(searchParams.get('start') || '1', 10);
	// const initialRows = parseInt(searchParams.get('rows') || '10', 10);

	const { result, isLoading, triggerSearchWithParams } =
		useSearchPersonsByNameSearch(apiSearchTerm, initialStart, initialRows);

	const handleValueChange = (newValue: string) => {
		searchParams.set('searchTerm', newValue);
		setSearchParams(searchParams);
		setApiSearchTerm(newValue);
	};

	const onSubmit = () => {
		triggerSearchWithParams('', 1, 1);
	};

	const onPaginationUpdate = (start: number, rows: number) => {
		// setPaginationVars(start, rows);
	};

	return (
		<>
			<SearchComponent
				rows={0}
				rowOptions={DEFAULT_ROW_OPTIONS}
				onRowUpdate={() => {}}
				value={searchTerm}
				onSubmit={onSubmit}
				onValueChange={handleValueChange}
			/>
			{result.data && (
				<PaginatedCardList
					list={result.data}
					rows={initialRows}
					onPaginationUpdate={onPaginationUpdate}
				/>
			)}
			{isLoading && <div>Laddar...</div>}
			{result.error && (
				<div>Ett fel har inträffat: &quot;{result.error.message}&quot;</div>
			)}
		</>
	);
};

export default PersonSearch;
