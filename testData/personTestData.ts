import Name from '../src/control/Name';
import Person from '../src/control/Person';
import { DataGroup } from '../src/converter/CoraData';
import { PersonObject } from '../src/converter/Person/PersonDefinitions';

export const completePersonDataGroup: DataGroup = {
	name: 'person',
	children: [
		{
			name: 'recordInfo',
			children: [
				{
					name: 'id',
					value: 'someId',
				},
			],
		},
		{
			name: 'academicTitle',
			value: 'someTitle',
		},
		{
			children: [
				{
					name: 'familyName',
					value: 'SomeFamilyName',
				},
				{
					name: 'givenName',
					value: 'SomeGivenName',
				},
			],
			name: 'authorisedName',
		},
		{
			name: 'alternativeName',
			children: [
				{
					name: 'familyName',
					value: 'SomeAlternativeFamilyName',
				},
				{
					name: 'givenName',
					value: 'SomeAlternativeGivenName',
				},
			],
			repeatId: '0',
		},
		{
			name: 'alternativeName',
			children: [
				{
					name: 'familyName',
					value: 'SomeOtherAlternativeFamilyName',
				},
				{
					name: 'givenName',
					value: 'SomeOtherAlternativeGivenName',
				},
			],
			repeatId: '1',
		},
		{
			repeatId: '0',
			name: 'ORCID_ID',
			value: '0000-0001-6885-9290',
		},
		{
			repeatId: '1',
			name: 'ORCID_ID',
			value: '0000-234-5454-65656',
		},
		{
			name: 'VIAF_ID',
			value: 'someViaf',
			repeatId: '0',
		},
		{
			name: 'VIAF_ID',
			value: 'someOtherViaf',
			repeatId: '1',
		},
		{
			name: 'Libris_ID',
			value: 'someLibris',
			repeatId: '0',
		},
		{
			name: 'Libris_ID',
			value: 'someOtherLibris',
			repeatId: '1',
		},
		{
			name: 'externalURL',
			children: [
				{
					name: 'linkTitle',
					value: 'Min profilsida UU',
				},
				{
					name: 'URL',
					value: 'someUrl',
				},
			],
			repeatId: '0',
		},
		{
			name: 'externalURL',
			children: [
				{
					name: 'linkTitle',
					value: 'ResearchGate',
				},
				{
					name: 'URL',
					value: 'https://www.researchgate.net',
				},
			],
			repeatId: '1',
		},
		{
			name: 'otherAffiliation',
			children: [
				{
					name: 'affiliation',
					value: 'Säffle högskola',
				},
				{
					name: 'affiliationFromYear',
					value: '1998',
				},
				{
					name: 'affiliationUntilYear',
					value: '2000',
				},
			],
			repeatId: '0',
		},
		{
			name: 'otherAffiliation',
			children: [
				{
					name: 'affiliation',
					value: 'Foobar skola',
				},
				{
					name: 'affiliationFromYear',
					value: '1970',
				},
				{
					name: 'affiliationUntilYear',
					value: '1990',
				},
			],
			repeatId: '1',
		},
	],
};

export const createMinimumPersonDataGroup = (): DataGroup => {
	return {
		name: 'person',
		children: [
			{
				name: 'recordInfo',
				children: [
					{
						name: 'id',
						value: 'someId',
					},
				],
			},
			{
				children: [
					{
						name: 'familyName',
						value: 'someFamilyName',
					},
					{
						name: 'givenName',
						value: 'someGivenName',
					},
				],
				name: 'authorisedName',
			},
		],
	};
};

const createCompletePerson = () => {
	const person = new Person(
		'someId',
		new Name('SomeFamilyName', 'SomeGivenName')
	);

	person.domains = ['someDomain', 'someOtherDomain'];

	person.academicTitle = 'someTitle';

	person.yearOfBirth = 'someYearOfBirth';
	person.yearOfDeath = 'someYearOfDeat';
	person.emailAddress = 'someEmailAddress';

	person.alternativeNames = [
		new Name('SomeAlternativeFamilyName', 'SomeAlternativeGivenName'),
		new Name('SomeOtherAlternativeFamilyName', 'SomeOtherAlternativeGivenName'),
	];

	person.externalURLs = [
		{
			linkTitle: 'Min profilsida UU',
			URL: 'someUrl',
		},
		{
			linkTitle: 'ResearchGate',
			URL: 'https://www.researchgate.net',
		},
	];

	person.otherAffiliation = [
		{
			affiliation: 'someAffiliation',
			affiliationFromYear: 'someAffiliationFromYear',
			affiliationUntilYear: 'someAffiliationUntilYear',
		},
		{
			affiliation: 'someOtherAffiliation',
			affiliationFromYear: 'someOtherAffiliationFromYear',
			affiliationUntilYear: 'someOtherAffiliationUntilYear',
		},
	];

	person.orcidIDs = ['0000-0001-6885-9290', '0000-234-5454-65656'];

	person.viafIDs = ['someViaf', 'someOtherViaf'];

	person.librisIDs = ['someLibris', 'someOtherLibris'];

	person.biographyEnglish = {
		biography: 'some biography',
		language: 'en',
	};
	person.biographySwedish = {
		biography: 'Någon rolig biografi',
		language: 'sv',
	};
	person.personDomainPart = [
		{ personDomainPart: 'somePersonDomainPartId' },
		{ personDomainPart: 'someOtherPersonDomainPartId' },
	];

	return person;
};
export const completePerson = createCompletePerson();

export const completePersonObject: PersonObject = {
	person: {
		recordInfo: {
			id: 'someId',
			domain: ['someDomain', 'someOtherDomain'],
		},
		authorisedName: {
			familyName: 'SomeFamilyName',
			givenName: 'SomeGivenName',
		},
		academicTitle: 'someTitle',
		yearOfBirth: 'someYearOfBirth',
		yearOfDeath: 'someYearOfDeat',
		emailAddress: 'someEmailAddress',
		alternativeName: [
			{
				familyName: 'SomeAlternativeFamilyName',
				givenName: 'SomeAlternativeGivenName',
			},
			{
				familyName: 'SomeOtherAlternativeFamilyName',
				givenName: 'SomeOtherAlternativeGivenName',
			},
		],
		externalURL: [
			{
				linkTitle: 'Min profilsida UU',
				URL: 'someUrl',
			},
			{
				linkTitle: 'ResearchGate',
				URL: 'https://www.researchgate.net',
			},
		],
		otherAffiliation: [
			{
				affiliation: 'someAffiliation',
				affiliationFromYear: 'someAffiliationFromYear',
				affiliationUntilYear: 'someAffiliationUntilYear',
			},
			{
				affiliation: 'someOtherAffiliation',
				affiliationFromYear: 'someOtherAffiliationFromYear',
				affiliationUntilYear: 'someOtherAffiliationUntilYear',
			},
		],
		ORCID_ID: ['0000-0001-6885-9290', '0000-234-5454-65656'],
		VIAF_ID: ['someViaf', 'someOtherViaf'],
		Libris_ID: ['someLibris', 'someOtherLibris'],
		biographyEnglish: {
			biography: 'some biography',
			language: 'en',
		},
		biographySwedish: {
			biography: 'Någon rolig biografi',
			language: 'sv',
		},
		personDomainPart: [
			{ personDomainPart: 'somePersonDomainPartId' },
			{ personDomainPart: 'someOtherPersonDomainPartId' },
		],
	},
};

export default { completePersonDataGroup };
