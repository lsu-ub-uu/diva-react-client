import api from '../src/control/api';

describe('Api', () => {
	it('should return the dummy persons', () => {
		const persons = api.getPersons();

		expect(persons[0].authorisedName.familyName).toBe('Anka');
		expect(persons[1].authorisedName.givenName).toBe('Gerd');
	});

	// Mock fetch
	// Kolla att fetch anropas med rätt parametrar
	// 1. Kolla att om vi får tillbaka en tom lista, resolvas det med en tom lista
	// 2. om vi får ett element i svarslistan, se till att det skickas till en personConverter

	describe('searchPersonsByNameSearch', () => {
		it('');
	});
});
