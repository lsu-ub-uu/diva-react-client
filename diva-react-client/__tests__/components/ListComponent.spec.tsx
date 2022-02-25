import React from 'react';
import { render } from '@testing-library/react';
import { List, Listable } from 'diva-cora-ts-api-wrapper';
import ListComponent from '../../src/components/ListComponent';

import CardList from '../../src/components/CardList';

jest.mock('../../src/components/CardList', () => {
	return jest.fn(() => null);
});

const emptyList = new List([], 1, 0, 0);
const data: Listable[] = [
	{ id: '1', recordType: 'someRecordType' },
	{ id: '2', recordType: 'someRecordType' },
	{ id: '3', recordType: 'someRecordType' },
];
const listWithThreeObjects = new List(data, 1, 3, 3);

describe('ListComponent...', () => {
	it('should take a List', () => {
		render(<ListComponent list={emptyList} />);
	});

	it('should pass the list data to CardList', () => {
		const { rerender } = render(<ListComponent list={emptyList} />);

		expect(CardList).toHaveBeenCalledTimes(1);
		expect(CardList).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({
				list: [],
			}),
			expect.any(Object)
		);

		rerender(<ListComponent list={listWithThreeObjects} />);
		expect(CardList).toHaveBeenCalledTimes(2);
		expect(CardList).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({
				list: data,
			}),
			expect.any(Object)
		);
	});
});
