import { Button } from 'grommet';
import React from 'react';
import styled from 'styled-components';
import usePagination from '../../hooks/usePagination';

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
			<Button onClick={goToFirstPage} disabled={isFirstPage} label="|&lt;" />

			<Button onClick={goToPreviousPage} disabled={isFirstPage} label="&lt;" />

			<div>
				{start}-{toNumber} av {totalNumber}
			</div>
			<Button onClick={goToNextPage} disabled={isLastPage} label="&gt;" />

			<Button onClick={goToLastPage} disabled={isLastPage} label="&gt;|" />
		</Parent>
	);
};

export default PaginationComponent;
