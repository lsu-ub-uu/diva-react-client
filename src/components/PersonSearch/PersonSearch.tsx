import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchComponent from '../SearchComponent';
import useSearchPersonsByNameSearch from './useSearchPersonsByNameSearch';

const PersonSearch = function () {
	const [searchParams, setSearchParams] = useSearchParams();
	const searchTerm = searchParams.get('searchTerm') || '';
	const [apiSearchTerm, setApiSearchTerm] = useState(searchTerm);
	const initialStart = parseInt(searchParams.get('start') || '1', 10);
	const initialRows = parseInt(searchParams.get('rows') || '10', 10);

	const { triggerSearch } = useSearchPersonsByNameSearch(
		apiSearchTerm,
		initialStart,
		initialRows
	);

	const handleValueChange = (newValue: string) => {
		searchParams.set('searchTerm', newValue);
		setSearchParams(searchParams);
	};

	return (
		<SearchComponent
			value={searchTerm}
			onSubmit={triggerSearch}
			onValueChange={handleValueChange}
		/>
	);
};

export default PersonSearch;
