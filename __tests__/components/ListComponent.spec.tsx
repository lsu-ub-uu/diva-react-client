import React from 'react';
import { render, screen } from '@testing-library/react';
import ListComponent from '../../src/components/ListComponent';
import { threePersonObjects } from '../../testData/personData';
import Person from '../../src/control/Person';
import Name from '../../src/control/Name';
import Card from '../../src/components/Card';

jest.mock('../../src/components/Card', () => {
	return jest.fn(() => null);
});

describe('The List component', () => {
	it('should take an array of Listables as props', () => {
		render(<ListComponent list={[]} />);
	});
	it('should render "Ingen data" if an empty list has been passed', () => {
		render(<ListComponent list={[]} />);
		expect(screen.getByText(/Ingen data/i)).toBeInTheDocument();
	});
	it('should render a list if a non-empty list has been passed', () => {
		const { rerender } = render(<ListComponent list={threePersonObjects} />);
		expect(screen.queryByText(/Ingen data/i)).not.toBeInTheDocument();

		const lists = screen.getAllByRole('list');
		expect(lists).toHaveLength(1);

		const listItems = screen.getAllByRole('listitem');
		expect(listItems).toHaveLength(3);

		const person: Person = new Person('4', new Name('Foo', 'Bar'));
		const fourPersonObjects: Person[] = Array.from(threePersonObjects);
		fourPersonObjects.push(person);

		rerender(<ListComponent list={fourPersonObjects} />);
		const listItems2 = screen.getAllByRole('listitem');
		expect(listItems2).toHaveLength(4);
	});
	it('should pass the Listable to a Card for each listItem', () => {
		render(<ListComponent list={threePersonObjects} />);

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
		const { rerender } = render(<ListComponent list={threePersonObjects} />);
		rerender(<ListComponent list={threePersonObjects} />);
		expect(Card).toBeCalledTimes(3);
	});
});
