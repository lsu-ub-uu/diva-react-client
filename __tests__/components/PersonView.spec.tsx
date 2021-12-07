import { render, screen } from '@testing-library/react';
import React from 'react';
import PersonView from '../../src/components/PersonView';
import Person from '../../src/control/Person';

const examplePerson: Person = new Person('someId', {
	familyName: 'Anka',
	givenName: 'Kalle',
});

describe('The Person component', () => {
	it('Should take a person object', () => {
		render(<PersonView person={examplePerson} />);
	});
	it('Should render a persons id', () => {
		render(<PersonView person={examplePerson} />);
		expect(screen.getByText(/someId/i)).toBeInTheDocument();
	});
	it('Should render a persons first and last name', () => {
		render(<PersonView person={examplePerson} />);
		expect(screen.getByText(/Kalle/i)).toBeInTheDocument();
		expect(screen.getByText(/Anka/i)).toBeInTheDocument();
	});
});
