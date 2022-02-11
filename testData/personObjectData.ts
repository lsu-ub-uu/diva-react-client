import List from '../src/control/List';
import { PersonObject } from '../src/converter/Person/PersonDefinitions';

export const personWithDomain: PersonObject = {
	id: '2',
	authorisedName: {
		familyName: 'Enequist',
		givenName: 'Gerd',
	},
	domains: ['Uppsala Universitet', 'Test'],
	recordType: 'person',
};

export const createPersonObject = (
	id: string,
	familyName: string,
	givenName: string
): PersonObject => {
	return {
		id,
		authorisedName: {
			familyName,
			givenName,
		},
		recordType: 'person',
	};
};

export const threePersonObjects: PersonObject[] = [
	createPersonObject('1', 'Anka', 'Kalle'),
	personWithDomain,
	createPersonObject('3', 'Ernman', 'Malena'),
];

export const createCompletePerson = () => {
	const completePerson: PersonObject = createPersonObject(
		'somePID',
		'Celsius',
		'Anders'
	);

	completePerson.academicTitle = 'someTitle';

	completePerson.orcids = ['someOrcid', 'someOtherOrcid'];
	completePerson.viafIDs = ['someViaf', 'someOtherViaf'];
	completePerson.librisIDs = ['someLibris', 'someOtherLibris'];

	completePerson.domains = ['someDomain', 'someOtherDomain'];

	completePerson.alternativeNames = [
		{
			familyName: 'someAlternativeFamilyName',
			givenName: 'someAlternativeGivenName',
		},
		{
			familyName: 'someOtherAlternativeFamilyName',
			givenName: 'someOtherAlternativeGivenName',
		},
	];

	return completePerson;
};

export const createMinimumPersonWithIdAndName = (
	id: string = 'someId',
	familyName: string = 'LastName',
	givenName: string = 'FirstName'
) => {
	return createPersonObject(id, familyName, givenName);
};

export const createListWithPersons = (persons: PersonObject[]) => {
	const toNumber = persons.length;
	return new List(persons, 1, toNumber, toNumber * 2);
};
export const completePerson: PersonObject = createCompletePerson();
