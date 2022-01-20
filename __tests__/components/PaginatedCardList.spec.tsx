import React from 'react';
import { render } from '@testing-library/react';
import PaginatedCardList from '../../src/components/PaginatedCardList';
import {
	personWithDomain,
	threePersonObjects,
} from '../../testData/personData';
import Person from '../../src/control/Person';
import List from '../../src/control/List';
import PaginationComponent from '../../src/components/PaginationComponent';
import CardList from '../../src/components/CardList';

jest.mock('../../src/components/PaginationComponent', () => {
	return jest.fn(() => {
		return <div />;
	});
});

jest.mock('../../src/components/CardList', () => {
	return jest.fn(() => {
		return <div />;
	});
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const defaultOnPaginationUpdate = (start: number, rows: number): void => {};

describe('PaginatedCardList', () => {
	it('should take list, onPaginationUpdate and rows as props', () => {
		render(
			<PaginatedCardList
				list={createListWithPersons(threePersonObjects)}
				onPaginationUpdate={defaultOnPaginationUpdate}
				rows={10}
			/>
		);
	});

	it('should pass list.fromNo, list.toNumber, list.totalNumber, onPaginationUpdate and rows to PaginationComponent', () => {
		const someList = createListWithPersons(threePersonObjects);
		const expectedRows = 10;
		const { rerender } = render(
			<PaginatedCardList
				list={someList}
				onPaginationUpdate={defaultOnPaginationUpdate}
				rows={expectedRows}
			/>
		);

		expect(PaginationComponent).toHaveBeenCalledTimes(1);
		expect(PaginationComponent).toHaveBeenLastCalledWith(
			expect.objectContaining({
				start: someList.fromNumber,
				rows: expectedRows,
				toNumber: someList.toNumber,
				totalNumber: someList.totalNumber,
				onPaginationUpdate: defaultOnPaginationUpdate,
			}),
			expect.any(Object)
		);

		const someOtherList = createListWithPersons(threePersonObjects);
		someOtherList.fromNumber = 3;
		someOtherList.toNumber = 6;
		someOtherList.totalNumber = 15;
		const otherExpectedRows = 50;
		const someOtherOnPaginationUpdate = () => {};

		rerender(
			<PaginatedCardList
				list={someOtherList}
				onPaginationUpdate={someOtherOnPaginationUpdate}
				rows={otherExpectedRows}
			/>
		);

		expect(PaginationComponent).toHaveBeenLastCalledWith(
			expect.objectContaining({
				start: someOtherList.fromNumber,
				rows: otherExpectedRows,
				toNumber: someOtherList.toNumber,
				totalNumber: someOtherList.totalNumber,
				onPaginationUpdate: someOtherOnPaginationUpdate,
			}),
			expect.any(Object)
		);
	});

	it('should pass list to CardList', () => {
		const someList = createListWithPersons(threePersonObjects);
		const { rerender } = render(
			<PaginatedCardList
				list={someList}
				onPaginationUpdate={defaultOnPaginationUpdate}
				rows={10}
			/>
		);

		expect(CardList).toHaveBeenCalledTimes(1);
		expect(CardList).toHaveBeenLastCalledWith(
			expect.objectContaining({
				list: someList.data,
			}),
			expect.any(Object)
		);

		const someOtherList = createListWithPersons([personWithDomain]);
		rerender(
			<PaginatedCardList
				list={someOtherList}
				onPaginationUpdate={defaultOnPaginationUpdate}
				rows={10}
			/>
		);

		expect(CardList).toHaveBeenCalledTimes(2);
		expect(CardList).toHaveBeenLastCalledWith(
			expect.objectContaining({
				list: someOtherList.data,
			}),
			expect.any(Object)
		);
	});
});

function createListWithPersons(persons: Person[]) {
	const toNumber = persons.length;
	return new List(persons, 1, toNumber, toNumber * 2);
}
