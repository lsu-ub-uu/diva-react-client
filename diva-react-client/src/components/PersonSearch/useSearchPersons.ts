import {searchOrganisationsByDomainAndSearchTerm }from 'diva-cora-ts-api-wrapper';
import {searchPersonsByGeneralSearch }from 'diva-cora-ts-api-wrapper';
	

	import React from 'react';
import useApi from '../../hooks/useApi';

const useSearchPersons = (
	initialSearchTerm: string,
	initialStart: number,
	initialRows: number
) => {
	const { isLoading, result, setApiParams } = (
		console.log("1sasdlöfjlkdsdffffffff",searchPersonsByGeneralSearch),
		useApi(
		searchPersonsByGeneralSearch,
		{}
	));

	React.useEffect(() => {
		possiblyCallApi(initialSearchTerm, initialStart, initialRows);
	}, []);

	const triggerSearchWithParams = (
		searchTerm: string,
		start: number,
		rows: number
	) => {
		possiblyCallApi(searchTerm, start, rows);
	};

	const possiblyCallApi = (searchTerm: string, start: number, rows: number) => {
		console.log("1",searchTerm);
		console.log("1.1",start);
		console.log("1.2",rows);
		console.log("1.3.2",searchOrganisationsByDomainAndSearchTerm);
		console.log("1.3.3",searchPersonsByGeneralSearch);
		
		if (searchTerm !== '') {
			setApiParams({
				searchTerm,
				start,
				rows,
			});
		}
	};

	return {
		triggerSearchWithParams,
		isLoading,
		result,
	};
};

export default useSearchPersons;
