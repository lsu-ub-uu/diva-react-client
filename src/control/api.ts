import Person from './Person';

const DUMMY_PERSONS: Person[] = [
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
		domains: ['Uppsala Universitet', 'Test'],
	},
	{
		id: '3',
		authorizedName: {
			familyName: 'Ernman',
			givenName: 'Malena',
		},
	},
];

function getOrganisation() {
	return 'SomeOtherOrg';
}

export function getPersons(): Person[] {
	return DUMMY_PERSONS;
}

export default { getOrganisation, getPersons };
