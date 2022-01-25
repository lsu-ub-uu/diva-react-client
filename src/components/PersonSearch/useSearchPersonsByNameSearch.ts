import React from 'react';
import { searchPersonsByNameSearch } from '../../control/api';
import useApi from '../../hooks/useApi';

const useSearchPersonsByNameSearch = (
	initialSearchTerm: string,
	initialStart: number,
	initialRows: number
) => {
	const { isLoading, result, setApiParams } = useApi(
		searchPersonsByNameSearch,
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

export default useSearchPersonsByNameSearch;
