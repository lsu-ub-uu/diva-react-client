import React from 'react';
import { render, screen } from '@testing-library/react';
import PersonList from '../../src/components/PersonList';
import Person from '../../src/control/Person';

const threePersonObjects: Person[] = [
	{
		id: '1',
		authorisedName: {
			familyName: 'Anka',
			givenName: 'Kalle',
		},
	},
	{
		id: '2',
		authorisedName: {
			familyName: 'Enequist',
			givenName: 'Gerd',
		},
		domains: ['Uppsala Universitet'],
	},
	{
		id: '3',
		authorisedName: {
			familyName: 'Ernman',
			givenName: 'Malena',
		},
	},
];

describe('The PersonList component', () => {
	it('should output "No Data" if an empty list has been passed"', () => {
		const persons: Person[] = [];

		render(<PersonList persons={persons} />);

		const noDataTexts = screen.queryAllByText('No Data');
		expect(noDataTexts).toHaveLength(1);

		const lists = screen.queryAllByRole('list');
		expect(lists).toHaveLength(0);
		const listItems = screen.queryAllByRole('listitem');
		expect(listItems).toHaveLength(0);
	});

	it('should render one person if one is passed', () => {
		const persons: Person[] = [
			{
				id: '1',
				authorisedName: {
					familyName: 'Anka',
					givenName: 'Kalle',
				},
			},
		];

		render(<PersonList persons={persons} />);

		const listItems = screen.getAllByRole('listitem');
		expect(listItems).toHaveLength(1);
		expect(listItems[0]).toHaveTextContent('1: Anka, Kalle');
	});

	it('should render several persons', () => {
		render(<PersonList persons={threePersonObjects} />);

		const listItems = screen.getAllByRole('listitem');
		expect(listItems).toHaveLength(3);
		expect(listItems[0]).toHaveTextContent('1: Anka, Kalle');
		expect(listItems[2]).toHaveTextContent('3: Ernman, Malena');
	});

	it('should expose a domain in []', () => {
		const persons: Person[] = [
			{
				id: '1',
				authorisedName: {
					familyName: 'Anka',
					givenName: 'Kalle',
				},
				domains: ['Uppsala Universitet'],
			},
		];

		render(<PersonList persons={persons} />);

		const listItems = screen.getAllByRole('listitem');
		expect(listItems).toHaveLength(1);
		expect(listItems[0]).toHaveTextContent(
			'1: Anka, Kalle [Uppsala Universitet]'
		);
	});

	it('should expose several domains in []', () => {
		const persons: Person[] = [
			{
				id: '1',
				authorisedName: {
					familyName: 'Anka',
					givenName: 'Kalle',
				},
				domains: ['Uppsala Universitet', 'Test'],
			},
		];

		render(<PersonList persons={persons} />);

		const listItems = screen.getAllByRole('listitem');
		expect(listItems).toHaveLength(1);
		expect(listItems[0]).toHaveTextContent(
			'1: Anka, Kalle [Uppsala Universitet, Test]'
		);
	});

	it('should not expose a domain of domain array empty', () => {
		const persons: Person[] = [
			{
				id: '1',
				authorisedName: {
					familyName: 'Anka',
					givenName: 'Kalle',
				},
				domains: [],
			},
		];

		render(<PersonList persons={persons} />);

		const listItems = screen.getAllByRole('listitem');
		expect(listItems).toHaveLength(1);
		expect(listItems[0]).toHaveTextContent('1: Anka, Kalle');
	});
});
