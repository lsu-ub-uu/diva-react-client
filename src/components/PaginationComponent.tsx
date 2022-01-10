import React from 'react';
import Button from '../styles/Button';

const PaginationComponent = function ({
	start = 1,
	rows = 100,
	totalNumber,
	onPaginationUpdate,
}: {
	start?: number;
	rows?: number;
	totalNumber: number;
	onPaginationUpdate(start: number, rows: number): void;
}) {
	const nextButtonIsDisabled = totalNumber - start < rows;

	const handleNextButtonClick = () => {
		onPaginationUpdate(start + rows, rows);
	};

	return (
		<Button onClick={handleNextButtonClick} disabled={nextButtonIsDisabled}>
			Nästa &gt;
		</Button>
	);
};

export default PaginationComponent;
