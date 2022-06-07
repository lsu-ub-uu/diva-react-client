import { List, Person } from 'diva-cora-ts-api-wrapper';
import { convertToFormPerson, FormPerson } from '../src/types/FormPerson';

export const personWithDomain: Person = {
	id: '2',
	authorisedName: {
		familyName: 'Enequist',
		givenName: 'Gerd',
	},
	domains: ['Uppsala Universitet', 'Test'],
	recordType: 'person',
	personDomainParts: [],
	public: 'yes',
};

export const formPersonWithDomain: FormPerson = {
	id: '2',
	authorisedName: {
		familyName: 'Enequist',
		givenName: 'Gerd',
	},
	domains: ['Uppsala Universitet', 'Test'],
	personDomainParts: [],
	public: 'yes',
	academicTitle: '',
	yearOfBirth: '',
	yearOfDeath: '',
	emailAddress: '',
	alternativeNames: [],
	externalURLs: [],
	otherAffiliation: {
		name: '',
		fromYear: '',
		untilYear: '',
	},
	orcids: [],
	viafIDs: [],
	librisIDs: [],
	biographyEnglish: '',
	biographySwedish: '',
};

export const createPersonObject = (
	id: string = 'someId',
	familyName: string = 'someFamilyName',
	givenName: string = 'someGivenName'
): Person => {
	return {
		id,
		authorisedName: {
			familyName,
			givenName,
		},
		recordType: 'person',
		personDomainParts: [],
		public: 'yes',
	};
};

export const createFormPersonObject = (
	id: string = 'someId',
	familyName: string = 'someFamilyName',
	givenName: string = 'someGivenName'
): FormPerson => {
	const person: FormPerson = {
		id,
		authorisedName: {
			familyName,
			givenName,
		},
		personDomainParts: [],
		public: 'yes',
		domains: [],
		academicTitle: '',
		yearOfBirth: '',
		yearOfDeath: '',
		emailAddress: '',
		alternativeNames: [],
		externalURLs: [],
		otherAffiliation: {
			name: '',
			fromYear: '',
			untilYear: '',
		},
		orcids: [],
		viafIDs: [],
		librisIDs: [],
		biographyEnglish: '',
		biographySwedish: '',
	};
	return person;
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
	completePerson.public = 'yes';

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
	completePerson.biographyEnglish = 'A nice biography in English<br/> foobar';

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

	completePerson.yearOfBirth = '1900';
	completePerson.yearOfDeath = '2000';
	completePerson.emailAddress = 'foo@bar.com';

	return completePerson;
};

export const createCompleteFormPerson = () => {
	const person = createCompletePerson();

	return convertToFormPerson(person);
};

export const createMinimumPersonWithIdAndName = (
	id: string = 'someId',
	familyName: string = 'LastName',
	givenName: string = 'FirstName'
) => {
	return createPersonObject(id, familyName, givenName);
};

export const createMinimumFormPersonWithIdAndName = (
	id: string = 'someId',
	familyName: string = 'LastName',
	givenName: string = 'FirstName'
) => {
	return createFormPersonObject(id, familyName, givenName);
};

export const createListWithPersons = (persons: Person[]) => {
	const toNumber = persons.length;
	return new List(persons, 1, toNumber, toNumber * 2);
};
export const completePerson: Person = createCompletePerson();
