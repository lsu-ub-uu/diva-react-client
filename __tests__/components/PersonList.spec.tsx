describe.skip('', () => {
	it.todo('Remove this if not needed');
});

// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import PersonList from '../../src/components/PersonList';
// import Person from '../../src/control/Person';
// import Card from '../../src/components/Card';

// jest.mock('../../src/components/Card');
// const mockedCard = jest.fn();
// const card = Card as jest.MockedFunction<typeof Card>;

// beforeEach(() => {
// 	jest.clearAllMocks();
// 	card.mockImplementation((props: any) => {
// 		mockedCard(props);
// 		return <div />;
// 	});
// });

// const onePerson = [
// 	new Person('1', {
// 		familyName: 'Anka',
// 		givenName: 'Kalle',
// 	}),
// ];
// const twoPersons = [
// 	new Person('1', {
// 		familyName: 'Anka',
// 		givenName: 'Kalle',
// 	}),
// 	new Person('2', {
// 		familyName: 'Broman',
// 		givenName: 'Sten',
// 	}),
// ];

// describe('The PersonList component', () => {
// 	it('should output "Ingen data" if an empty list has been passed"', () => {
// 		const persons: Person[] = [];

// 		render(<PersonList persons={persons} />);

// 		const noDataTexts = screen.queryAllByText('Ingen data');
// 		expect(noDataTexts).toHaveLength(1);

// 		const lists = screen.queryAllByRole('list');
// 		expect(lists).toHaveLength(0);
// 		const listItems = screen.queryAllByRole('listitem');
// 		expect(listItems).toHaveLength(0);
// 	});

// 	it('should render a list if a non-empty list has been passed', () => {
// 		const persons: Person[] = onePerson;

// 		render(<PersonList persons={persons} />);

// 		const lists = screen.getAllByRole('list');
// 		expect(lists).toHaveLength(1);
// 	});

// 	it('should call Card once if one person in list', () => {
// 		const persons: Person[] = onePerson;

// 		render(<PersonList persons={persons} />);

// 		expect(mockedCard).toHaveBeenCalledTimes(1);
// 	});

// 	it('should call Card several times if several persons in list', () => {
// 		const persons: Person[] = twoPersons;

// 		render(<PersonList persons={persons} />);

// 		expect(mockedCard).toHaveBeenCalledTimes(2);
// 	});

// 	it('should call PersonList with personID and personName', () => {
// 		const persons: Person[] = twoPersons;

// 		render(<PersonList persons={persons} />);

// 		expect(mockedCard).toHaveBeenNthCalledWith(
// 			1,
// 			expect.objectContaining({
// 				id: '1',
// 				text: 'Anka, Kalle',
// 			})
// 		);
// 	});
// });
