import convertToObject from '../Converter';
import { DataGroup } from '../../cora-data/CoraData';
import { personMatcher } from '../definitions/PersonDefinitions';
import { Person } from '../../types/Person';

describe('Full test of converter', () => {
	it('Converts every field', () => {
		const completePersonObject: Person = convertToObject<Person>(
			completePersonDataGroup,
			personMatcher
		);

		expect(completePersonObject).toStrictEqual(expectedCompletePerson);
	});
	it.only('Handles required fields correctly', () => {
		const minimumPersonObject: Person = convertToObject<Person>(
			minimumPersonDataGroup,
			personMatcher
		);
		expect(minimumPersonObject).toStrictEqual(expectedMinimumPerson);
	});
});

const expectedMinimumPerson: Person = {
	id: 'authority-person:2',
	recordType: 'person',
	authorisedName: {
		givenName: '',
		familyName: 'someGivenName',
	},
	personDomainParts: [],
	public: 'yes',
};

const expectedCompletePerson: Person = {
	id: 'authority-person:1',
	public: 'yes',
	recordType: 'person',
	domains: ['du', 'hig', 'ivl', 'ltu', 'miun', 'ths', 'umu', 'uu'],
	authorisedName: {
		familyName: 'FamilyName',
		givenName: 'GivenName',
	},
	academicTitle: 'titel',
	yearOfBirth: '1965',
	yearOfDeath: '2222',
	emailAddress: 'someone@something.some',
	alternativeNames: [
		{
			familyName: 'FamilyName',
			givenName: 'G',
		},
		{
			familyName: 'F',
			givenName: 'GivenName',
		},
	],
	externalURLs: [
		{
			linkTitle: 'MP',
			URL: 'https://mp.uu.se/',
		},
		{
			linkTitle: 'ResearchGate',
			URL: 'https://www.researchgate.net',
		},
	],
	otherAffiliation: {
		name: 'Någon högskola',
		fromYear: '1998',
		untilYear: '2000',
	},
	orcids: ['someOrcid', 'someOtherOrcid'],
	viafIDs: ['someViafId', 'someOtherViafId'],
	librisIDs: ['someLibrisId', 'someOtherLibrisId'],
	biographyEnglish:
		'<p>A biography is an account of a person\'s life. If the production is made by the author himself, it is called autobiography or memoirs. The word biography comes from the Greek biography, of bios, "life", and graphō, "write". An author of biographies is called cinema. :)</p>',
	biographySwedish:
		'<p>En biografi är en redogörelse för en persons liv. Om framställningen är gjord av författaren själv kallas den självbiografi eller memoarer. Ordet biografi kommer av grekiskans biographia, av bios, "liv", och graphō, "skriva". En författare av biografier kallas biograf.</p>',
	personDomainParts: [
		{
			recordId: 'authority-person:1:du',
		},
		{
			recordId: 'authority-person:1:hig',
		},
		{
			recordId: 'authority-person:1:ivl',
		},
		{
			recordId: 'authority-person:1:ltu',
		},
		{
			recordId: 'authority-person:1:miun',
		},
		{
			recordId: 'authority-person:1:ths',
		},
		{
			recordId: 'authority-person:1:umu',
		},
		{
			recordId: 'authority-person:1:uu',
		},
	],
};

const minimumPersonDataGroup: DataGroup = {
	name: 'person',
	children: [
		{
			name: 'recordInfo',
			children: [
				{
					name: 'id',
					value: 'authority-person:2',
				},
				{
					name: 'public',
					value: 'yes',
				},
				{
					name: 'type',
					children: [
						{
							name: 'linkedRecordType',
							value: 'recordType',
						},
						{
							name: 'linkedRecordId',
							value: 'person',
						},
					],
				},
				{
					name: 'createdBy',
					children: [
						{
							name: 'linkedRecordType',
							value: 'user',
						},
						{
							name: 'linkedRecordId',
							value: 'SYSTEM',
						},
					],
				},
			],
		},
		{
			name: 'authorisedName',
			children: [{ name: 'familyName', value: 'someGivenName' }],
		},
	],
};

const completePersonDataGroup: DataGroup = {
	name: 'person',
	children: [
		{
			name: 'recordInfo',
			children: [
				{
					name: 'id',
					value: 'authority-person:1',
				},
				{
					name: 'type',
					children: [
						{
							name: 'linkedRecordType',
							value: 'recordType',
						},
						{
							name: 'linkedRecordId',
							value: 'person',
						},
					],
				},
				{
					name: 'createdBy',
					children: [
						{
							name: 'linkedRecordType',
							value: 'user',
						},
						{
							name: 'linkedRecordId',
							value: 'SYSTEM',
						},
					],
				},
				{
					name: 'dataDivider',
					children: [
						{
							name: 'linkedRecordType',
							value: 'system',
						},
						{
							name: 'linkedRecordId',
							value: 'diva',
						},
					],
				},
				{
					name: 'tsCreated',
					value: '2016-09-02T10:59:47.428Z',
				},
				{
					name: 'public',
					value: 'yes',
				},
				{
					name: 'domain',
					value: 'du',
					repeatId: '0',
				},
				{
					name: 'domain',
					value: 'hig',
					repeatId: '1',
				},
				{
					name: 'domain',
					value: 'ivl',
					repeatId: '2',
				},
				{
					name: 'domain',
					value: 'ltu',
					repeatId: '3',
				},
				{
					name: 'domain',
					value: 'miun',
					repeatId: '4',
				},
				{
					name: 'domain',
					value: 'ths',
					repeatId: '5',
				},
				{
					name: 'domain',
					value: 'umu',
					repeatId: '6',
				},
				{
					name: 'domain',
					value: 'uu',
					repeatId: '7',
				},
			],
		},
		{
			name: 'authorisedName',
			children: [
				{
					name: 'familyName',
					value: 'FamilyName',
				},
				{
					name: 'givenName',
					value: 'GivenName',
				},
			],
		},
		{
			name: 'academicTitle',
			value: 'titel',
		},
		{
			name: 'emailAddress',
			value: 'someone@something.some',
		},
		{
			name: 'yearOfBirth',
			value: '1965',
		},
		{
			name: 'yearOfDeath',
			value: '2222',
		},
		{
			name: 'alternativeName',
			children: [
				{
					name: 'familyName',
					value: 'FamilyName',
				},
				{
					name: 'givenName',
					value: 'G',
				},
			],
			repeatId: '0',
		},
		{
			name: 'alternativeName',
			children: [
				{
					name: 'familyName',
					value: 'F',
				},
				{
					name: 'givenName',
					value: 'GivenName',
				},
			],
			repeatId: '1',
		},
		{
			name: 'externalURL',
			children: [
				{
					name: 'linkTitle',
					value: 'MP',
				},
				{
					name: 'URL',
					value: 'https://mp.uu.se/',
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
					value: 'Någon högskola',
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
			name: 'ORCID_ID',
			value: 'someOrcid',
			repeatId: '0',
		},
		{
			name: 'ORCID_ID',
			value: 'someOtherOrcid',
			repeatId: '1',
		},
		{
			name: 'VIAF_ID',
			value: 'someViafId',
			repeatId: '0',
		},
		{
			name: 'VIAF_ID',
			value: 'someOtherViafId',
			repeatId: '1',
		},
		{
			name: 'Libris_ID',
			value: 'someLibrisId',
			repeatId: '0',
		},
		{
			name: 'Libris_ID',
			value: 'someOtherLibrisId',
			repeatId: '1',
		},
		{
			name: 'biographyEnglish',
			children: [
				{
					name: 'biography',
					value: '<p>A biography is an account of a person\'s life. If the production is made by the author himself, it is called autobiography or memoirs. The word biography comes from the Greek biography, of bios, "life", and graphō, "write". An author of biographies is called cinema. :)</p>',
				},
				{
					name: 'language',
					value: 'en',
				},
			],
		},
		{
			name: 'biographySwedish',
			children: [
				{
					name: 'biography',
					value: '<p>En biografi är en redogörelse för en persons liv. Om framställningen är gjord av författaren själv kallas den självbiografi eller memoarer. Ordet biografi kommer av grekiskans biographia, av bios, "liv", och graphō, "skriva". En författare av biografier kallas biograf.</p>',
				},
				{
					name: 'language',
					value: 'sv',
				},
			],
		},
		{
			name: 'personDomainPart',
			children: [
				{
					name: 'linkedRecordType',
					value: 'personDomainPart',
				},
				{
					name: 'linkedRecordId',
					value: 'authority-person:1:du',
				},
			],
			repeatId: '0',
		},
		{
			name: 'personDomainPart',
			children: [
				{
					name: 'linkedRecordType',
					value: 'personDomainPart',
				},
				{
					name: 'linkedRecordId',
					value: 'authority-person:1:hig',
				},
			],
			repeatId: '1',
		},
		{
			name: 'personDomainPart',
			children: [
				{
					name: 'linkedRecordType',
					value: 'personDomainPart',
				},
				{
					name: 'linkedRecordId',
					value: 'authority-person:1:ivl',
				},
			],
			repeatId: '2',
		},
		{
			name: 'personDomainPart',
			children: [
				{
					name: 'linkedRecordType',
					value: 'personDomainPart',
				},
				{
					name: 'linkedRecordId',
					value: 'authority-person:1:ltu',
				},
			],
			repeatId: '3',
		},
		{
			name: 'personDomainPart',
			children: [
				{
					name: 'linkedRecordType',
					value: 'personDomainPart',
				},
				{
					name: 'linkedRecordId',
					value: 'authority-person:1:miun',
				},
			],
			repeatId: '4',
		},
		{
			name: 'personDomainPart',
			children: [
				{
					name: 'linkedRecordType',
					value: 'personDomainPart',
				},
				{
					name: 'linkedRecordId',
					value: 'authority-person:1:ths',
				},
			],
			repeatId: '5',
		},
		{
			name: 'personDomainPart',
			children: [
				{
					name: 'linkedRecordType',
					value: 'personDomainPart',
				},
				{
					name: 'linkedRecordId',
					value: 'authority-person:1:umu',
				},
			],
			repeatId: '6',
		},
		{
			name: 'personDomainPart',
			children: [
				{
					name: 'linkedRecordType',
					value: 'personDomainPart',
				},
				{
					name: 'linkedRecordId',
					value: 'authority-person:1:uu',
				},
			],
			repeatId: '7',
		},
	],
};
