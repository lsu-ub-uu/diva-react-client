import React from 'react';
import { render, screen } from '@testing-library/react';
import ListComponent from '../../src/components/ListComponent';
import { threePersonObjects } from '../../testData/personData';
import Person from '../../src/control/Person';
import Name from '../../src/control/Name';

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
		const fourPersonObjects: Person[] = threePersonObjects;
		fourPersonObjects.push(person);

		rerender(<ListComponent list={fourPersonObjects} />);
		const listItems2 = screen.getAllByRole('listitem');
		expect(listItems2).toHaveLength(4);
	});
	it.todo('should pass the Listable to a Card for each listItem');
});
