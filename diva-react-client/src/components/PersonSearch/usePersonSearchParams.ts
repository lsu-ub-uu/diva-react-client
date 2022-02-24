import { useSearchParams } from 'react-router-dom';

const RADIX = 10;
const DEFAULT_START = 1;
const DEFAULT_ROWS = 10;
const MAX_ROWS = 1000;

const usePersonSearchParams = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const searchTerm = searchParams.get('searchTerm') || '';
	const startString = searchParams.get('start') || '';
	const rowsString = searchParams.get('rows') || '';

	const start = getPositiveNumberOrDefault(startString, DEFAULT_START);
	const rows = getRowNumber(rowsString);

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

const getRowNumber = (toParse: string) => {
	const parsedNumber = getPositiveNumberOrDefault(toParse, DEFAULT_ROWS);
	return parsedNumber <= MAX_ROWS ? parsedNumber : MAX_ROWS;
};

const getPositiveNumberOrDefault = (toParse: string, defaultNumber: number) => {
	const parsedNumber = parseInt(toParse, RADIX);
	return !Number.isNaN(parsedNumber) && numberIsPositive(parsedNumber)
		? parsedNumber
		: defaultNumber;
};

const numberIsPositive = (numberToCheck: number) => {
	return numberToCheck > 0;
};

export default usePersonSearchParams;
