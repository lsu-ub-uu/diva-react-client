import { List } from '../src/types/List';
import { Person } from '../src/types/Person';
import { Record } from '../src/types/Record';

export const personWithDomain: Person = {
	id: '2',
	authorisedName: {
		familyName: 'Enequist',
		givenName: 'Gerd',
	},
	domains: ['Uppsala Universitet', 'Test'],
	recordType: 'person',
	personDomainParts: [],
	connectedDomains: [],
};

export const createPersonObject = (
	id: string,
	familyName: string,
	givenName: string
): Person => {
	return {
		id,
		authorisedName: {
			familyName,
			givenName,
		},
		recordType: 'person',
		personDomainParts: [],
		connectedDomains: [],
	};
};

export const threePersonObjects: Person[] = [
	createPersonObject('1', 'Anka', 'Kalle'),
	personWithDomain,
	createPersonObject('3', 'Ernman', 'Malena'),
];

export const createCompletePerson = () => {
	const completePerson: Person = createPersonObject(
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

	completePerson.externalURLs = [
		{ URL: 'http://du.se', linkTitle: 'DU' },
		{ URL: 'http://uu.se', linkTitle: 'Uppsala Universitet' },
	];

	completePerson.biographySwedish = 'A nice biography<br/> foobar';

	completePerson.otherAffiliation = {
		name: 'SomeOtherAffiliation',
		fromYear: '2000',
		untilYear: '2001',
	};

	completePerson.personDomainParts = [
		{
			recordId: 'personDomainPart1',
		},
		{
			recordId: 'personDomainPart2',
		},
		{
			recordId: 'personDomainPart3',
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

export const createListWithRecords = (records: Record[]) => {
	const toNumber = records.length;
	return new List(records, 1, toNumber, toNumber * 2);
};
export const completePerson: Person = createCompletePerson();
