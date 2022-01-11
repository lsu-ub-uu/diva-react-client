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

	return (
		<>
			{!isFirstPage && (
				<Button onClick={handlePreviousButtonClick}>&lt; Föregående</Button>
			)}
			{!isLastPage && (
				<Button onClick={handleNextButtonClick}>Nästa &gt;</Button>
			)}
			{!isLastPage && (
				<Button onClick={handleLastButtonClick}>Sista &gt;|</Button>
			)}
		</>
	);
};

export default PaginationComponent;
