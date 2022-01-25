import { useSearchParams } from 'react-router-dom';

const usePersonSearchParams = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const searchTerm = searchParams.get('searchTerm');
	const startString = searchParams.get('start') || '';
	const rowsString = searchParams.get('rows') || '';

	const start = getPositiveNumberOrDefault(startString, 1);
	const rows = getPositiveNumberOrDefault(rowsString, 10);

	const setSearchTerm = (newSearchTerm: string) => {
		searchParams.set('searchTerm', newSearchTerm);
		setSearchParams(searchParams);
	};

	const setStart = (newStart: number) => {
		searchParams.set('start', newStart.toString());
		setSearchParams(searchParams);
	};

	const setRows = (newRows: number) => {
		searchParams.set('rows', newRows.toString());
		setSearchParams(searchParams);
	};

	return { searchTerm, start, rows, setSearchTerm, setStart, setRows };
};

const getPositiveNumberOrDefault = (toParse: string, defaultNumber: number) => {
	const parsedNumber = parseInt(toParse, 10);
	return !Number.isNaN(parsedNumber) && parsedNumber > 0
		? parsedNumber
		: defaultNumber;
};

export default usePersonSearchParams;
