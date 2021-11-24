import React from 'react';
import { render, screen } from '@testing-library/react';
import PersonList from '../../src/components/PersonList';
import Person from '../../src/control/Person';

describe('The PersonList component', () => {
	it('should output empty list if there is an empty ', () => {
		const persons: Person[] = [];

		render(<PersonList persons={persons} />);

		const lists = screen.getAllByRole('list');
		expect(lists).toHaveLength(1);
		const listItems = screen.queryAllByRole('listitem');
		expect(listItems).toHaveLength(0);
	});

	it('should render one person if one is passed', () => {
		const persons: Person[] = [
			{
				id: '1',
				authorizedName: {
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
		const persons: Person[] = [
			{
				id: '1',
				authorizedName: {
					familyName: 'Anka',
					givenName: 'Kalle',
				},
			},
			{
				id: '2',
				authorizedName: {
					familyName: 'Enequist',
					givenName: 'Gerd',
				},
				domains: ['Uppsala Universitet'],
			},
			{
				id: '3',
				authorizedName: {
					familyName: 'Ernman',
					givenName: 'Malena',
				},
			},
		];

		render(<PersonList persons={persons} />);

		const listItems = screen.getAllByRole('listitem');
		expect(listItems).toHaveLength(3);
		expect(listItems[0]).toHaveTextContent('1: Anka, Kalle');
		expect(listItems[2]).toHaveTextContent('3: Ernman, Malena');
	});

	it('should expose a domain in []', () => {
		const persons: Person[] = [
			{
				id: '1',
				authorizedName: {
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
				authorizedName: {
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
				authorizedName: {
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
