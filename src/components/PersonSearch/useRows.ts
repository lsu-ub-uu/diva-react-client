const useRows = (rows: number, maxRows: number, defaultRows: number) => {
	const rowsToReturn = rows >= 1 && rows <= maxRows ? rows : defaultRows;
	return { rows: rowsToReturn };
};

export default useRows;
