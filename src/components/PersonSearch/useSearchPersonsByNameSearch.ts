import React, { useState } from 'react';
import { searchPersonsByNameSearch } from '../../control/api';
import useApi from '../../hooks/useApi';

const useSearchPersonsByNameSearch = (
	searchTerm: string,
	initialStart?: number,
	initialRows?: number
) => {
	const cleanInitialStart = initialStart ? getPositiveNumber(initialStart) : 1;
	const cleanInitialRows = initialRows ? getCleanRowNumber(initialRows) : 10;

	const [paginationVars, setPaginationVars] = useState({
		start: cleanInitialStart,
		rows: cleanInitialRows,
	});
	const { isLoading, result, setApiParams } = useApi(
		searchPersonsByNameSearch,
		{}
	);

	const safelySetPaginationVars = (newStart: number, newRows: number) => {
		const start = getPositiveNumber(newStart);
		const rows = getCleanRowNumber(newRows);

		setPaginationVarsIfTheyHaveChanged(start, rows);
	};

	const setPaginationVarsIfTheyHaveChanged = (start: number, rows: number) => {
		if (start !== paginationVars.start || rows !== paginationVars.rows) {
			setPaginationVars({ start, rows });
		}
	};

	const triggerSearch = () => {
		possiblyCallApi();
	};

	React.useEffect(() => {
		possiblyCallApi();
	}, [paginationVars]);

	const possiblyCallApi = () => {
		if (searchTerm !== '') {
			setApiParams({
				searchTerm,
				start: paginationVars.start,
				rows: paginationVars.rows,
			});
		}
	};

	return {
		paginationVars,
		setPaginationVars: safelySetPaginationVars,
		triggerSearch,
		isLoading,
		result,
	};
};

const getPositiveNumber = (num: number): number => {
	return num >= 1 ? num : 1;
};

const getPositiveNumberOrMaxDefault = (
	num: number,
	maxDefault: number
): number => {
	const positiveNumber = getPositiveNumber(num);
	return positiveNumber > maxDefault ? maxDefault : positiveNumber;
};

const getCleanRowNumber = (num: number): number => {
	return getPositiveNumberOrMaxDefault(num, 1000);
};

export default useSearchPersonsByNameSearch;
