import React from 'react';
import Button from '../styles/Button';

const PaginationComponent = function ({
	start,
	rows,
	totalNumber,
	onPaginationUpdate,
}: {
	start: number;
	rows: number;
	totalNumber: number;
	onPaginationUpdate(start: number, rows: number): void;
}) {
	const isFirstPage = start === 1;
	const isLastPage = totalNumber - start < rows;
	const remainingRows = totalNumber - start;

	const handleNextButtonClick = () => {
		onPaginationUpdate(start + rows, rows);
	};

	const handleLastButtonClick = () => {
		const lastStartValue = Math.floor(remainingRows / rows) * rows + start;
		onPaginationUpdate(lastStartValue, rows);
	};

	const handlePreviousButtonClick = () => {
		const previousStartValue = start - rows < 1 ? 1 : start - rows;
		onPaginationUpdate(previousStartValue, rows);
	};

	const handleFirstButtonClick = () => {
		onPaginationUpdate(1, rows);
	};

	return (
		<>
			<Button onClick={handleFirstButtonClick} disabled={isFirstPage}>
				|&lt; Första
			</Button>
			<Button onClick={handlePreviousButtonClick} disabled={isFirstPage}>
				&lt; Föregående
			</Button>
			<Button onClick={handleNextButtonClick} disabled={isLastPage}>
				Nästa &gt;
			</Button>
			<Button onClick={handleLastButtonClick} disabled={isLastPage}>
				Sista &gt;|
			</Button>
		</>
	);
};

export default PaginationComponent;
