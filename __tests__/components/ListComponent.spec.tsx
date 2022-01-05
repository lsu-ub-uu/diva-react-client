import React from 'react';
import { render } from '@testing-library/react';
import ListComponent from '../../src/components/ListComponent';
import List from '../../src/control/List';

import CardList from '../../src/components/CardList';
import { threePersonObjects } from '../../testData/personData';

jest.mock('../../src/components/CardList', () => {
	return jest.fn(() => null);
});

const emptyList = new List([], 1, 0, 0);
const threePersonList = new List(threePersonObjects, 1, 3, 3);

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

		rerender(<ListComponent list={threePersonList} />);
		expect(CardList).toHaveBeenCalledTimes(2);
		expect(CardList).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({
				list: threePersonObjects,
			}),
			expect.any(Object)
		);
	});
});
