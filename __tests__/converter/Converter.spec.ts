import Person from '../../src/control/Person';
import convertPerson from '../../src/converter/Converter';
import { DataGroup } from '../../src/converter/CoraData';
import {
	completePersonDataGroup,
	createMinimumPersonDataGroup,
} from '../../testData/personDataGroups';

describe('The functions in converter can be used to convert DataGroups to TS-objects', () => {
	describe('convertPerson', () => {
		it('returns an empty Person if all fields were empty', () => {
			const person: Person = convertPerson(emptyPersonDataGroup);

			expect(person.authorisedName.familyName).toStrictEqual('');
			expect(person.authorisedName.givenName).toStrictEqual('');
			expect(person.id).toStrictEqual('');
			expect(person.presentation).toBeDefined();
			expect(person.authorisedName.toString()).toStrictEqual('');
		});

		it('Sets empty name if DataGroup for name does not exist', () => {
			const person: Person = convertPerson(personDataGroupWithOnlyId);

			expect(person.authorisedName.familyName).toStrictEqual('');
			expect(person.authorisedName.givenName).toStrictEqual('');
			expect(person.id).toStrictEqual('someId');
		});

		it('Sets the authorisedName', () => {
			const person: Person = convertPerson(
				personDataGroupWithIdAndAuthorisedName
			);

			expect(person.authorisedName.familyName).toStrictEqual('SomeFamilyName');
			expect(person.authorisedName.givenName).toStrictEqual('SomeGivenName');
			expect(person.id).toStrictEqual('someId');
			expect(person.authorisedName.toString()).toStrictEqual(
				'SomeFamilyName, SomeGivenName'
			);
		});

		describe('alternative names', () => {
			it('does not add an alternative name if there is none', () => {
				const person: Person = convertPerson(personDataGroupWithId);

				expect(person.alternativeNames).toHaveLength(0);
			});

			it('does add alternative names if there are alternative names', () => {
				const person = convertPerson(completePersonDataGroup);

				expect(person.alternativeNames).toHaveLength(2);
			});

			it('can handle if given name is missing', () => {
				const personDataGroup = createMinimumPersonDataGroup();
				personDataGroup.children.push({
					name: 'alternativeName',
					children: [
						{
							name: 'familyName',
							value: 'SomeAlternativeFamilyName',
						},
					],
					repeatId: '0',
				});

				const person = convertPerson(personDataGroup);

				expect(person.alternativeNames).toHaveLength(1);
				expect(person.alternativeNames[0].givenName).toStrictEqual('');
				expect(person.alternativeNames[0].familyName).toStrictEqual(
					'SomeAlternativeFamilyName'
				);
			});

			it('can handle if family name is missing', () => {
				const personDataGroup = createMinimumPersonDataGroup();
				personDataGroup.children.push({
					name: 'alternativeName',
					children: [
						{
							name: 'givenName',
							value: 'SomeAlternativeGivenName',
						},
					],
					repeatId: '0',
				});

				const person = convertPerson(personDataGroup);

				expect(person.alternativeNames).toHaveLength(1);
				expect(person.alternativeNames[0].familyName).toStrictEqual('');
				expect(person.alternativeNames[0].givenName).toStrictEqual(
					'SomeAlternativeGivenName'
				);
			});

			it('can handle if both family and given name are missing', () => {
				const personDataGroup = createMinimumPersonDataGroup();
				personDataGroup.children.push({
					name: 'alternativeName',
					children: [],
					repeatId: '0',
				});

				const person = convertPerson(personDataGroup);

				expect(person.alternativeNames).toHaveLength(1);
				expect(person.alternativeNames[0].familyName).toStrictEqual('');
				expect(person.alternativeNames[0].givenName).toStrictEqual('');
			});
		});

		describe('identifiers', () => {
			it('Sets the pID', () => {
				const person: Person = convertPerson(personDataGroupWithId);

				expect(person.authorisedName.familyName).toStrictEqual('');
				expect(person.authorisedName.givenName).toStrictEqual('');
				expect(person.id).toStrictEqual('someId');
			});
			it('Sets ORCID if it exists in DataGroup, even if multiple', () => {
				const person: Person = convertPerson(
					personDataGroupWithIdAndAuthorisedNameAndOneOrcidViafLibris
				);
				expect(person.orcidIDs[0]).toStrictEqual('0000-0001-6885-9290');

				const person2: Person = convertPerson(
					personDataGroupWithIdAndAuthorisedNameMultipleOrcidViafLibris
				);

				expect(person2.orcidIDs).toHaveLength(2);
				expect(person2.orcidIDs[0]).toStrictEqual('0000-0001-6885-9290');
				expect(person2.orcidIDs[1]).toStrictEqual('0000-234-5454-65656');
			});

			it('Does not set ORCID if value is an empty string', () => {
				const person: Person = convertPerson(
					personDataGroupWithIdAndAuthorisedNameAndOneEMPTYOrcidViafLibris
				);
				expect(person.orcidIDs).toHaveLength(0);
			});

			it('Sets VIAF if it exists in DataGroup, even if multiple', () => {
				const person: Person = convertPerson(
					personDataGroupWithIdAndAuthorisedNameAndOneOrcidViafLibris
				);
				expect(person.viafIDs[0]).toStrictEqual('someViaf');

				const person2: Person = convertPerson(
					personDataGroupWithIdAndAuthorisedNameMultipleOrcidViafLibris
				);

				expect(person2.viafIDs).toHaveLength(2);
				expect(person2.viafIDs[1]).toStrictEqual('someOtherViaf');
			});

			it('Does not set VIAF if value is an empty string', () => {
				const person: Person = convertPerson(
					personDataGroupWithIdAndAuthorisedNameAndOneEMPTYOrcidViafLibris
				);
				expect(person.viafIDs).toHaveLength(0);
			});

			it('Sets LibrisId if it exists in DataGroup, even if multiple', () => {
				const person: Person = convertPerson(
					personDataGroupWithIdAndAuthorisedNameAndOneOrcidViafLibris
				);
				expect(person.librisIDs[0]).toStrictEqual('someLibris');

				const person2: Person = convertPerson(
					personDataGroupWithIdAndAuthorisedNameMultipleOrcidViafLibris
				);

				expect(person2.librisIDs).toHaveLength(2);
				expect(person2.librisIDs[1]).toStrictEqual('someOtherLibris');
			});

			it('Does not set LibrisId if value is an empty string', () => {
				const person: Person = convertPerson(
					personDataGroupWithIdAndAuthorisedNameAndOneEMPTYOrcidViafLibris
				);
				expect(person.librisIDs).toHaveLength(0);
			});

			it('Does not set ORCID, viaf and libris if ORCID does not exist in DataGroup', () => {
				const person: Person = convertPerson(
					personDataGroupWithIdAndAuthorisedName
				);

				expect(person.orcidIDs).toHaveLength(0);
				expect(person.viafIDs).toHaveLength(0);
				expect(person.librisIDs).toHaveLength(0);
			});
		});

		describe('title', () => {
			it('sets the title if it exists', () => {
				const person = convertPerson(completePersonDataGroup);

				expect(person.title).toStrictEqual('someTitle');
			});

			it('does not set the title if it does NOT exists', () => {
				const person = convertPerson(createMinimumPersonDataGroup());

				expect(person.title).toStrictEqual('');
			});
		});

		describe('external Urls', () => {});
	});
});

const emptyPersonDataGroup: DataGroup = {
	name: 'person',
	children: [
		{
			name: 'recordInfo',
			children: [
				{
					name: 'id',
					value: '',
				},
			],
		},
		{
			children: [
				{
					name: 'familyName',
					value: '',
				},
				{
					name: 'givenName',
					value: '',
				},
			],
			name: 'authorisedName',
		},
	],
};

const personDataGroupWithId: DataGroup = {
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
					value: '',
				},
				{
					name: 'givenName',
					value: '',
				},
			],
			name: 'authorisedName',
		},
	],
};

const personDataGroupWithIdAndAuthorisedName: DataGroup = {
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
					value: 'SomeFamilyName',
				},
				{
					name: 'givenName',
					value: 'SomeGivenName',
				},
			],
			name: 'authorisedName',
		},
	],
};

const personDataGroupWithIdAndAuthorisedNameAndOneOrcidViafLibris: DataGroup = {
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
			repeatId: '0',
			name: 'ORCID_ID',
			value: '0000-0001-6885-9290',
		},
		{
			name: 'VIAF_ID',
			value: 'someViaf',
			repeatId: '0',
		},
		{
			name: 'Libris_ID',
			value: 'someLibris',
			repeatId: '0',
		},
	],
};

const personDataGroupWithIdAndAuthorisedNameAndOneEMPTYOrcidViafLibris: DataGroup =
	{
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
				repeatId: '0',
				name: 'ORCID_ID',
				value: '',
			},
			{
				name: 'VIAF_ID',
				value: '',
				repeatId: '0',
			},
			{
				name: 'Libris_ID',
				value: '',
				repeatId: '0',
			},
		],
	};

const personDataGroupWithIdAndAuthorisedNameMultipleOrcidViafLibris: DataGroup =
	{
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
		],
	};

const personDataGroupWithOnlyId: DataGroup = {
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
	],
};
