import React from 'react';
import { render, screen } from '@testing-library/react';
import { Person } from 'diva-cora-ts-api-wrapper';
import CardList from './CardList';
import {
	createPersonObject,
	threePersonObjects,
} from '../../../testData/personObjectData';
import Card from './Card';

jest.mock('./Card', () => {
	return jest.fn(() => null);
});

describe('The List component', () => {
	it('should take an array of Listables and fromNumber as props', () => {
		render(<CardList list={[]} fromNumber={1} />);
	});
	it('should render "Inga träffar matchade sökningen" if an empty list has been passed', () => {
		render(<CardList list={[]} fromNumber={1} />);
		expect(
			screen.getByText(/Inga träffar matchade sökningen/i)
		).toBeInTheDocument();
	});
	it('should render a list if a non-empty list has been passed', () => {
		const { rerender } = render(
			<CardList list={threePersonObjects} fromNumber={1} />
		);
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

		rerender(<CardList list={fourPersonObjects} fromNumber={1} />);
		const listItems2 = screen.getAllByRole('listitem');
		expect(listItems2).toHaveLength(4);
	});
	it('should pass the Listable to a Card for each listItem', () => {
		render(<CardList list={threePersonObjects} fromNumber={1} />);

		expect(Card).toBeCalledTimes(3);
		expect(Card).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({
				item: threePersonObjects[0],
				listItemNumber: expect.any(Number),
			}),
			expect.any(Object)
		);
		expect(Card).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({
				item: threePersonObjects[1],
				listItemNumber: expect.any(Number),
			}),
			expect.any(Object)
		);
		expect(Card).toHaveBeenNthCalledWith(
			3,
			expect.objectContaining({
				item: threePersonObjects[2],
				listItemNumber: expect.any(Number),
			}),
			expect.any(Object)
		);
	});
	it('should pass fromNumber + arrayIndex to a Card for each listItem', () => {
		const { rerender } = render(
			<CardList list={threePersonObjects} fromNumber={1} />
		);

		expect(Card).toHaveBeenCalledTimes(3);
		expect(Card).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({
				item: expect.any(Object),
				listItemNumber: 1,
			}),
			expect.any(Object)
		);
		expect(Card).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({
				item: expect.any(Object),
				listItemNumber: 2,
			}),
			expect.any(Object)
		);
		expect(Card).toHaveBeenNthCalledWith(
			3,
			expect.objectContaining({
				item: expect.any(Object),
				listItemNumber: 3,
			}),
			expect.any(Object)
		);

		rerender(<CardList list={threePersonObjects} fromNumber={1234} />);

		expect(Card).toHaveBeenCalledTimes(6);
		expect(Card).toHaveBeenNthCalledWith(
			4,
			expect.objectContaining({
				item: expect.any(Object),
				listItemNumber: 1234,
			}),
			expect.any(Object)
		);
		expect(Card).toHaveBeenNthCalledWith(
			5,
			expect.objectContaining({
				item: expect.any(Object),
				listItemNumber: 1235,
			}),
			expect.any(Object)
		);
		expect(Card).toHaveBeenNthCalledWith(
			6,
			expect.objectContaining({
				item: expect.any(Object),
				listItemNumber: 1236,
			}),
			expect.any(Object)
		);
	});
	it('should use React.memo', () => {
		const { rerender } = render(
			<CardList list={threePersonObjects} fromNumber={1} />
		);
		rerender(<CardList list={threePersonObjects} fromNumber={1} />);
		expect(Card).toBeCalledTimes(3);
	});
});
