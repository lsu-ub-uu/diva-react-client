import React, { useState } from 'react';
import styled from 'styled-components';
import usePagination from '../hooks/usePagination';
import Button from '../styles/Button';

const Parent = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
	grid-template-rows: 1fr;
	align-items: center;
	justify-items: center;
`;
const defaultRowOptions = [10, 25, 50, 100];

const PaginationComponent = React.memo(
	({
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
		onPaginationUpdate(start: number, rows: number): void;
	}) => {
		const [selectedRowOption, setSelectedRowOption] = useState<number>(0);

		const {
			goToFirstPage,
			goToPreviousPage,
			goToNextPage,
			goToLastPage,
			isFirstPage,
			isLastPage,
		} = usePagination(start, rows, totalNumber, onPaginationUpdate);

		React.useEffect(() => {
			const newRowOption = getRowsOrDefaultValue(rows);
			setSelectedRowOption(newRowOption);
		}, [rows]);

		function getRowsOrDefaultValue(providedRows: number) {
			return providedRows < 1 || providedRows > 100 ? 50 : providedRows;
		}

		const handleRowChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
			const newRows = parseInt(event.target.value, 10);
			setSelectedRowOption(newRows);
			onPaginationUpdate(start, newRows);
		};

		return (
			<Parent>
				<Button onClick={goToFirstPage} disabled={isFirstPage}>
					|&lt; Första
				</Button>
				<Button onClick={goToPreviousPage} disabled={isFirstPage}>
					&lt; Föregående
				</Button>
				<div>
					{start}-{toNumber} av {totalNumber}
				</div>
				<label id="rows-label" htmlFor="rows-input">
					Träffar per sida
					<select
						id="rows-input"
						aria-labelledby="rows-label"
						value={selectedRowOption}
						onChange={handleRowChange}
					>
						{defaultRowOptions.map((option) => {
							return (
								<option key={option} value={option.toString()}>
									{option.toString()}
								</option>
							);
						})}
						{!defaultRowOptions.includes(selectedRowOption) && (
							<option
								key={selectedRowOption}
								value={selectedRowOption.toString()}
							>
								{selectedRowOption.toString()}
							</option>
						)}
					</select>
				</label>
				<Button onClick={goToNextPage} disabled={isLastPage}>
					Nästa &gt;
				</Button>
				<Button onClick={goToLastPage} disabled={isLastPage}>
					Sista &gt;|
				</Button>
			</Parent>
		);
	}
);

export default PaginationComponent;
