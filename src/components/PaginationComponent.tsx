import React from 'react';
import styled from 'styled-components';
import usePagination from '../hooks/usePagination';
import Button from '../styles/Button';

const Parent = styled.div`
	display: grid;
	grid-template-columns: auto auto auto auto auto auto;
	grid-template-rows: 1fr;
	align-items: center;
	justify-items: center;
	justify-content: center;
	column-gap: 0.5em;
`;

const PaginationComponent = function ({
	start,
	rows,
	toNumber,
	totalNumber,
	onPaginationUpdate,
}: {
	start: number;
	rows: number;
	toNumber: number;
	totalNumber: number;
	onPaginationUpdate(start: number): void;
}) {
	const {
		goToFirstPage,
		goToPreviousPage,
		goToNextPage,
		goToLastPage,
		isFirstPage,
		isLastPage,
	} = usePagination(start, rows, totalNumber, onPaginationUpdate);

	return (
		<Parent>
			<Button onClick={goToFirstPage} disabled={isFirstPage}>
				|&lt;
			</Button>
			<Button onClick={goToPreviousPage} disabled={isFirstPage}>
				&lt;
			</Button>
			<div>
				{start}-{toNumber} av {totalNumber}
			</div>
			<Button onClick={goToNextPage} disabled={isLastPage}>
				&gt;
			</Button>
			<Button onClick={goToLastPage} disabled={isLastPage}>
				&gt;|
			</Button>
		</Parent>
	);
};

export default PaginationComponent;
