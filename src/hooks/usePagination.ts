const usePagination = (
	start: number,
	rows: number,
	totalNumber: number,
	onPaginationUpdate: (start: number, rows: number) => void
) => {
	function goToFirstPage() {
		onPaginationUpdate(1, rows);
	}

	function goToPreviousPage() {
		const previousStart = start - rows < 1 ? 1 : start - rows;
		onPaginationUpdate(previousStart, rows);
	}

	function goToNextPage() {
		const nextStart = start + rows > totalNumber ? totalNumber : start + rows;
		onPaginationUpdate(nextStart, rows);
	}

	function goToLastPage() {
		const remainingRows = totalNumber - start;
		const lastStartValue = Math.floor(remainingRows / rows) * rows + start;
		onPaginationUpdate(lastStartValue, rows);
	}

	function getIsFirstPage() {
		return start === 1;
	}

	function getIsLastPage() {
		return totalNumber - start <= rows;
	}

	return {
		goToFirstPage,
		goToPreviousPage,
		goToNextPage,
		goToLastPage,
		isFirstPage: getIsFirstPage(),
		isLastPage: getIsLastPage(),
	};
};

export default usePagination;
