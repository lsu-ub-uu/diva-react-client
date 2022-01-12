import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../styles/Button';

const Parent = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
	grid-template-rows: 1fr;
	align-items: center;
	justify-items: center;
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
	onPaginationUpdate(start: number, rows: number): void;
}) {
	const getRowsOrDefaultValue = (providedRows: number) => {
		return providedRows < 1 || providedRows > 100 ? 50 : providedRows;
	};

	const defaultRowOptions = [10, 25, 50, 100];
	const isFirstPage = start === 1;
	const isLastPage = totalNumber - start < rows;
	const remainingRows = totalNumber - start;
	const providedRowOption = getRowsOrDefaultValue(rows);
	const [selectedRowOption, setSelectedRowOption] =
		useState<number>(providedRowOption);

	React.useEffect(() => {
		const newRowOption = getRowsOrDefaultValue(rows);
		setSelectedRowOption(newRowOption);
	}, [rows]);

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

	const handleRowChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const newRows = parseInt(event.target.value, 10);
		setSelectedRowOption(newRows);
		onPaginationUpdate(start, newRows);
	};

	return (
		<Parent>
			<Button onClick={handleFirstButtonClick} disabled={isFirstPage}>
				|&lt; Första
			</Button>
			<Button onClick={handlePreviousButtonClick} disabled={isFirstPage}>
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
			<Button onClick={handleNextButtonClick} disabled={isLastPage}>
				Nästa &gt;
			</Button>
			<Button onClick={handleLastButtonClick} disabled={isLastPage}>
				Sista &gt;|
			</Button>
		</Parent>
	);
};

export default PaginationComponent;
