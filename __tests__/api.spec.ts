import api from '../src/control/api';

describe('Api', () => {
	it('should return the dummy persons', () => {
		const persons = api.getPersons();

		expect(persons[0].authorizedName.familyName).toBe('Anka');
		expect(persons[1].authorizedName.givenName).toBe('Gerd');
	});
});
