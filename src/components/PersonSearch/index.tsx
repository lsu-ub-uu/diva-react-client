import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PaginatedCardList from '../PaginatedCardList';
import SearchComponent from '../SearchComponent';
import useSearchPersonsByNameSearch from './useSearchPersonsByNameSearch';

const PersonSearch = function () {
	const [searchParams, setSearchParams] = useSearchParams();
	const searchTerm = searchParams.get('searchTerm') || '';
	const [apiSearchTerm, setApiSearchTerm] = useState(searchTerm);
	const initialStart = parseInt(searchParams.get('start') || '1', 10);
	const initialRows = parseInt(searchParams.get('rows') || '10', 10);

	const {
		triggerSearch,
		result,
		paginationVars,
		setPaginationVars,
		isLoading,
	} = useSearchPersonsByNameSearch(apiSearchTerm, initialStart, initialRows);

	const handleValueChange = (newValue: string) => {
		searchParams.set('searchTerm', newValue);
		setSearchParams(searchParams);
		setApiSearchTerm(newValue);
	};

	const onPaginationUpdate = (start: number, rows: number) => {
		setPaginationVars(start, rows);
	};

	return (
		<>
			<SearchComponent
				value={searchTerm}
				onSubmit={triggerSearch}
				onValueChange={handleValueChange}
			/>
			{result.data && (
				<PaginatedCardList
					list={result.data}
					rows={paginationVars.rows}
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
