import React from 'react';
import styled from 'styled-components';
import List from '../cora/types/List';
import CardList from './CardList';
import PaginationComponent from './PaginationComponent';

const Parent = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: auto;
	row-gap: 1em;
`;

const PaginatedCardList = function ({
	list,
	onPaginationUpdate,
	rows,
}: {
	list: List;
	onPaginationUpdate(start: number): void;
	rows: number;
}) {
	return (
		<Parent>
			<PaginationComponent
				start={list.fromNumber}
				rows={rows}
				toNumber={list.toNumber}
				totalNumber={list.totalNumber}
				onPaginationUpdate={onPaginationUpdate}
			/>
			<CardList list={list.data} />
		</Parent>
	);
};

export default PaginatedCardList;
