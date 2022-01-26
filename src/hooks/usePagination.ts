const usePagination = (
	start: number,
	rows: number,
	totalNumber: number,
	onPaginationUpdate: (start: number) => void
) => {
	function goToFirstPage() {
		onPaginationUpdate(1);
	}

	function goToPreviousPage() {
		const previousStart = start - rows < 1 ? 1 : start - rows;
		onPaginationUpdate(previousStart);
	}

	function goToNextPage() {
		const nextStart = start + rows > totalNumber ? totalNumber : start + rows;
		onPaginationUpdate(nextStart);
	}

	function goToLastPage() {
		const remainingRows = totalNumber - start;
		const lastStartValue = Math.floor(remainingRows / rows) * rows + start;
		onPaginationUpdate(lastStartValue);
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
