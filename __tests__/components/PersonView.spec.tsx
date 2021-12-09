import { render, screen } from '@testing-library/react';
import React from 'react';
import PersonView from '../../src/components/PersonView';
import Person from '../../src/control/Person';

const examplePerson: Person = new Person('someId', {
	familyName: 'Anka',
	givenName: 'Kalle',
});

describe('The Person component', () => {
	it('Should take a person id and render it', () => {
		render(<PersonView id={examplePerson.id} />);
		expect(screen.getByText(/Person: someId/i)).toBeInTheDocument();
	});
});
