import { completePersonDataGroup } from '../../testData/personTestData';
import { DataGroup } from './CoraData';
import GenericConverter from './GenericConverter';
import {
	objectName,
	personMultipleDefinition,
	PersonObject,
} from './Person/PersonDefinitions';

describe('GenericConverter', () => {
	describe('GenericConverter', () => {
		it('constructor takes a multipleDefinition', () => {
			const converter = new GenericConverter([]);
			expect(converter).toBeDefined();
		});
	});

	describe('convertToGenericObject', () => {
		it('converts a top-level DataAtomic (0-1) and returns an object containing its data', () => {
			type TypeToConvertTo = {
				someKey: {
					title: string;
				};
			};
			const dataGroup: DataGroup = {
				name: 'someKey',
				children: [
					{
						name: 'title',
						value: 'someTitle',
					},
				],
			};

			const converter = new GenericConverter([]);
			const genericObject =
				converter.convertToGenericObject<TypeToConvertTo>(dataGroup);

			expect(genericObject.someKey.title).toStrictEqual('someTitle');
		});
		it('converts a top-level DataGroup (0-1) and returns an object containing its data', () => {
			type TypeToConvertTo = {
				someKey: {
					title: string[];
				};
			};
			const dataGroup: DataGroup = {
				name: 'someKey',
				children: [
					{
						name: 'title',
						value: 'someTitle',
					},
					{
						name: 'title',
						value: 'someOtherTitle',
					},
				],
			};

			const converter = new GenericConverter(['title']);
			const genericObject =
				converter.convertToGenericObject<TypeToConvertTo>(dataGroup);

			expect(genericObject.someKey.title).toStrictEqual([
				'someTitle',
				'someOtherTitle',
			]);
		});

		it('converts a full dataGroup', () => {
			const converter = new GenericConverter(personMultipleDefinition);

			const personObject = converter.convertToGenericObject<PersonObject>(
				completePersonDataGroup
			);

			const alternativeNames = <objectName[]>(
				personObject.person.alternativeName
			);

			expect(alternativeNames).toBeDefined();
			expect(alternativeNames).toHaveLength(2);

			expect(alternativeNames[0].familyName).toStrictEqual(
				'SomeAlternativeFamilyName'
			);
			expect(alternativeNames[0].givenName).toStrictEqual(
				'SomeAlternativeGivenName'
			);

			expect(alternativeNames[1].familyName).toStrictEqual(
				'SomeOtherAlternativeFamilyName'
			);
			expect(alternativeNames[1].givenName).toStrictEqual(
				'SomeOtherAlternativeGivenName'
			);
		});
	});
});
