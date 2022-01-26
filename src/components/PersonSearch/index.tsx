import React from 'react';
import PaginatedCardList from '../PaginatedCardList';
import SearchComponent from '../SearchComponent';
import usePersonSearchParams from './usePersonSearchParams';
import useSearchPersonsByNameSearch from './useSearchPersonsByNameSearch';

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
		triggerSearchWithParams(searchTerm, start, rows);
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
		<>
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
		</>
	);
};

export default PersonSearch;
