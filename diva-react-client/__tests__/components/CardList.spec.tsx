import React from 'react';
import { render, screen } from '@testing-library/react';
import { Person } from 'diva-cora-ts-api-wrapper';
import CardList from '../../src/components/CardList';
import {
	createPersonObject,
	threePersonObjects,
} from '../../testData/personObjectData';
import Card from '../../src/components/Card';

jest.mock('../../src/components/Card', () => {
	return jest.fn(() => null);
});

describe('The List component', () => {
	it('should take an array of Listables as props', () => {
		render(<CardList list={[]} />);
	});
	it('should render "Inga träffar matchade sökningen" if an empty list has been passed', () => {
		render(<CardList list={[]} />);
		expect(
			screen.getByText(/Inga träffar matchade sökningen/i)
		).toBeInTheDocument();
	});
	it('should render a list if a non-empty list has been passed', () => {
		const { rerender } = render(<CardList list={threePersonObjects} />);
		expect(
			screen.queryByText(/Inga träffar matchade sökningen./i)
		).not.toBeInTheDocument();

		const lists = screen.getAllByRole('list');
		expect(lists).toHaveLength(1);

		const listItems = screen.getAllByRole('listitem');
		expect(listItems).toHaveLength(3);

		const person: Person = createPersonObject('4', 'Foo', 'Bar');
		const fourPersonObjects: Person[] = Array.from(threePersonObjects);
		fourPersonObjects.push(person);

		rerender(<CardList list={fourPersonObjects} />);
		const listItems2 = screen.getAllByRole('listitem');
		expect(listItems2).toHaveLength(4);
	});
	it('should pass the Listable to a Card for each listItem', () => {
		render(<CardList list={threePersonObjects} />);

		expect(Card).toBeCalledTimes(3);
		expect(Card).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({
				item: threePersonObjects[0],
			}),
			expect.any(Object)
		);
		expect(Card).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({
				item: threePersonObjects[1],
			}),
			expect.any(Object)
		);
		expect(Card).toHaveBeenNthCalledWith(
			3,
			expect.objectContaining({
				item: threePersonObjects[2],
			}),
			expect.any(Object)
		);
	});
	it('should use React.memo', () => {
		const { rerender } = render(<CardList list={threePersonObjects} />);
		rerender(<CardList list={threePersonObjects} />);
		expect(Card).toBeCalledTimes(3);
	});
});
