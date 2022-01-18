import React, { useState } from 'react';
import styled from 'styled-components';
import usePagination from '../hooks/usePagination';
import Button from '../styles/Button';
import Select from '../styles/Select';

const Parent = styled.div`
	display: grid;
	grid-template-columns: auto auto auto auto auto auto;
	grid-template-rows: 1fr;
	align-items: center;
	justify-items: center;
	justify-content: center;
	column-gap: 0.5em;
`;
const StyledLabel = styled.label`
	display: grid;
	grid-template-columns: auto auto;
	grid-template-rows: 1fr;
	align-items: center;
	column-gap: 0.5em;
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
					|&lt;
				</Button>
				<Button onClick={goToPreviousPage} disabled={isFirstPage}>
					&lt;
				</Button>
				<div>
					{start}-{toNumber} av {totalNumber}
				</div>
				<StyledLabel id="rows-label" htmlFor="rows-input">
					<Select
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
					</Select>
					<div>Träffar per sida</div>
				</StyledLabel>
				<Button onClick={goToNextPage} disabled={isLastPage}>
					&gt;
				</Button>
				<Button onClick={goToLastPage} disabled={isLastPage}>
					&gt;|
				</Button>
			</Parent>
		);
	}
);

export default PaginationComponent;
