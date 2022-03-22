import { searchPersonsByGeneralSearch } from 'diva-cora-ts-api-wrapper';
import React from 'react';
import useApi from '../../hooks/useApi';

const useSearchPersons = (
	initialSearchTerm: string,
	initialStart: number,
	initialRows: number
) => {
	const { isLoading, result, setApiParams } = useApi(
		searchPersonsByGeneralSearch,
		{}
	);

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
