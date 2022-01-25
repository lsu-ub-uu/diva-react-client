import useRows from './useRows';

const useRowsWithString = (
	rowsString: string,
	maxRows: number,
	defaultRows: number
) => {
	const parsedRow: number = parseInt(rowsString, 10);
	const row = Number.isNaN(parsedRow) ? defaultRows : parsedRow;
	return useRows(row, maxRows, defaultRows);
};

export default useRowsWithString;
