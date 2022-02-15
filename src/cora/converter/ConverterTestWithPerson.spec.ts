import convertToObject from './Converter';
import { DataGroup } from '../cora-data/CoraData';
import { personMatcher } from './definitions/PersonDefinitions';
import { Person } from '../types/Person';

describe('Full test of converter', () => {
	it('Converts every field', () => {
		const personObject: Person = convertToObject<Person>(
			personDataGroup,
			personMatcher
		);

		console.log(personObject);

		expect(personObject).toStrictEqual(expectedPerson);
	});
});

const expectedPerson: Person = {
	id: 'authority-person:11685',
	domains: ['du', 'hig', 'ivl', 'ltu', 'miun', 'ths', 'umu', 'uu'],
	authorisedName: {
		familyName: 'Ericsson',
		givenName: 'Urban',
	},
	academicTitle: 'titel',
	recordType: 'person',
	orcids: ['0000-0001-6885-2022'],
	viafIDs: ['q122'],
	librisIDs: ['12321'],
	externalURLs: [
		{
			linkTitle: 'Min profilsida UU',
			URL: 'https://mp.uu.se/web/profilsidor/start/-/emp/N99-921',
		},
		{
			linkTitle: 'ResearchGate',
			URL: 'https://www.researchgate.net',
		},
	],
	biographySwedish:
		'<p>En biografi är en redogörelse för en persons liv. Om framställningen är gjord av författaren själv kallas den självbiografi eller memoarer. Ordet biografi kommer av grekiskans biographia, av bios, "liv", och graphō, "skriva". En författare av biografier kallas biograf.</p>',
	biographyEnglish:
		'<p>A biography is an account of a person\'s life. If the production is made by the author himself, it is called autobiography or memoirs. The word biography comes from the Greek biography, of bios, "life", and graphō, "write". An author of biographies is called cinema. :)</p>',
};

const personDataGroup: DataGroup = {
	name: 'person',
	children: [
		{
			name: 'recordInfo',
			children: [
				{
					name: 'id',
					value: 'authority-person:11685',
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
					value: 'Ericsson',
				},
				{
					name: 'givenName',
					value: 'Urban',
				},
			],
		},
		{
			name: 'academicTitle',
			value: 'titel',
		},
		{
			name: 'emailAddress',
			value: 'urban.ericsson@ub.uu.se',
		},
		{
			name: 'alternativeName',
			children: [
				{
					name: 'familyName',
					value: 'Ericsson',
				},
				{
					name: 'givenName',
					value: 'K',
				},
			],
			repeatId: '0',
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
					value: 'https://mp.uu.se/web/profilsidor/start/-/emp/N99-921',
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
			name: 'ORCID_ID',
			value: '0000-0001-6885-2022',
			repeatId: '0',
		},
		{
			name: 'VIAF_ID',
			value: 'q122',
			repeatId: '0',
		},
		{
			name: 'Libris_ID',
			value: '12321',
			repeatId: '0',
		},
		{
			name: 'biographyEnglish',
			children: [
				{
					name: 'biography',
					value:
						'<p>A biography is an account of a person\'s life. If the production is made by the author himself, it is called autobiography or memoirs. The word biography comes from the Greek biography, of bios, "life", and graphō, "write". An author of biographies is called cinema. :)</p>',
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
					value:
						'<p>En biografi är en redogörelse för en persons liv. Om framställningen är gjord av författaren själv kallas den självbiografi eller memoarer. Ordet biografi kommer av grekiskans biographia, av bios, "liv", och graphō, "skriva". En författare av biografier kallas biograf.</p>',
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
					value: 'authority-person:11685:du',
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
					value: 'authority-person:11685:hig',
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
					value: 'authority-person:11685:ivl',
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
					value: 'authority-person:11685:ltu',
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
					value: 'authority-person:11685:miun',
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
					value: 'authority-person:11685:ths',
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
					value: 'authority-person:11685:umu',
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
					value: 'authority-person:11685:uu',
				},
			],
			repeatId: '7',
		},
	],
};
