import Person from '../../src/control/Person';
import convertPerson from '../../src/converter/Converter';
import { DataGroup } from '../../src/converter/CoraData';

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

		it('Sets the ID', () => {
			const person: Person = convertPerson(personDataGroupWithId);

			expect(person.authorisedName.familyName).toStrictEqual('');
			expect(person.authorisedName.givenName).toStrictEqual('');
			expect(person.id).toStrictEqual('someId');
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

		it('Sets the other ids, (eg viaf, libris, orcid)', () => {
			const person: Person = convertPerson(
				personDataGroupWithIdAndAuthorisedNameAndOrcid
			);
			expect(person.otherIds[0]).toStrictEqual({
				type: 'ORCID',
				id: '0000-0001-6885-9290',
			});
		});
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

const personDataGroupWithIdAndAuthorisedNameAndOrcid: DataGroup = {
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
