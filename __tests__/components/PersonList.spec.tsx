import React from 'react';
import { render, screen } from '@testing-library/react';
import PersonList from '../../src/components/PersonList';
import Person from '../../src/control/Person';
import Card from '../../src/components/styles/Card';

jest.mock('../../src/components/styles/Card');
const mockedCard = jest.fn();
const card = Card as jest.MockedFunction<typeof Card>;

beforeEach(() => {
	jest.clearAllMocks();
	card.mockImplementation((props: any) => {
		mockedCard(props);
		return <div />;
	});
});

// const threePersonObjects: Person[] = [
// 	{
// 		id: '1',
// 		authorisedName: {
// 			familyName: 'Anka',
// 			givenName: 'Kalle',
// 		},
// 	},
// 	{
// 		id: '2',
// 		authorisedName: {
// 			familyName: 'Enequist',
// 			givenName: 'Gerd',
// 		},
// 		domains: ['Uppsala Universitet'],
// 	},
// 	{
// 		id: '3',
// 		authorisedName: {
// 			familyName: 'Ernman',
// 			givenName: 'Malena',
// 		},
// 	},
// ];

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

	it('Should return a list if a non-empty list has been passed', () => {
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

		const lists = screen.getAllByRole('list');
		expect(lists).toHaveLength(1);
	});

	it('Should call Card once if one person in list', () => {
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

		expect(mockedCard).toHaveBeenCalledTimes(1);
	});

	it('Should call Card several time if several persons in list', () => {
		const persons: Person[] = [
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
					familyName: 'Broman',
					givenName: 'Sten',
				},
			},
		];

		render(<PersonList persons={persons} />);

		expect(mockedCard).toHaveBeenCalledTimes(2);
	});

	it('Should call Person List with a Person array', () => {
		const persons: Person[] = [
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
					familyName: 'Broman',
					givenName: 'Sten',
				},
			},
		];

		render(<PersonList persons={persons} />);

		expect(mockedCard).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({
				personID: '1',
				personName: {
					familyName: 'Anka',
					givenName: 'Kalle',
				},
			})
		);
	});

	// it('should render several persons', () => {
	// 	render(<PersonList persons={threePersonObjects} />);

	// 	const listItems = screen.getAllByRole('listitem');
	// 	expect(listItems).toHaveLength(3);
	// 	expect(listItems[0]).toHaveTextContent('1: Anka, Kalle');
	// 	expect(listItems[2]).toHaveTextContent('3: Ernman, Malena');
	// });

	// it('should expose a domain in []', () => {
	// 	const persons: Person[] = [
	// 		{
	// 			id: '1',
	// 			authorisedName: {
	// 				familyName: 'Anka',
	// 				givenName: 'Kalle',
	// 			},
	// 			domains: ['Uppsala Universitet'],
	// 		},
	// 	];

	// 	render(<PersonList persons={persons} />);

	// 	const listItems = screen.getAllByRole('listitem');
	// 	expect(listItems).toHaveLength(1);
	// 	expect(listItems[0]).toHaveTextContent(
	// 		'1: Anka, Kalle [Uppsala Universitet]'
	// 	);
	// });

	// it('should expose several domains in []', () => {
	// 	const persons: Person[] = [
	// 		{
	// 			id: '1',
	// 			authorisedName: {
	// 				familyName: 'Anka',
	// 				givenName: 'Kalle',
	// 			},
	// 			domains: ['Uppsala Universitet', 'Test'],
	// 		},
	// 	];

	// 	render(<PersonList persons={persons} />);

	// 	const listItems = screen.getAllByRole('listitem');
	// 	expect(listItems).toHaveLength(1);
	// 	expect(listItems[0]).toHaveTextContent(
	// 		'1: Anka, Kalle [Uppsala Universitet, Test]'
	// 	);
	// });

	// it('should not expose a domain of domain array empty', () => {
	// 	const persons: Person[] = [
	// 		{
	// 			id: '1',
	// 			authorisedName: {
	// 				familyName: 'Anka',
	// 				givenName: 'Kalle',
	// 			},
	// 			domains: [],
	// 		},
	// 	];

	// 	render(<PersonList persons={persons} />);

	// 	const listItems = screen.getAllByRole('listitem');
	// 	expect(listItems).toHaveLength(1);
	// 	expect(listItems[0]).toHaveTextContent('1: Anka, Kalle');
	// });
});
