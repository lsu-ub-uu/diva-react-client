import { createMinimumPersonDataGroup } from '../../testData/personDataGroups';
import { DataGroup } from './CoraData';
import { convertToGenericObject, PersonObject } from './GenericConverter';

const personMultipleDefinition = {
	person: false,
	recordInfo: false,
	id: false,
	authorisedName: false,
	familyName: false,
	academicTitle: false,
};

describe('GenericConverter', () => {
	describe('convertToGenericObject', () => {
		it('takes a dataGroup and a key definition array and returns type that has been provided', () => {
			const dataGroup: DataGroup = createMinimumPersonDataGroup();

			const personObject = convertToGenericObject<PersonObject>(dataGroup);
			expect(personObject.person).toBeDefined();
		});

		it('converts a top-level DataAtomic (0-1) and returns an object containing its data', () => {
			const dataGroup: DataGroup = {
				name: 'person',
				children: [
					{
						name: 'academicTitle',
						value: 'someTitle',
					},
				],
			};
			const genericObject = <any>convertToGenericObject(dataGroup);
			expect(genericObject.person[0].academicTitle).toStrictEqual([
				'someTitle',
			]);
		});

		it('traverses a top-level DataGroup (0-1)', () => {
			const dataGroup: DataGroup = createMinimumPersonDataGroup();

			const genericObject = <PersonObject>convertToGenericObject(dataGroup);

			expect(genericObject.person[0].recordInfo[0].id).toStrictEqual([
				'someId',
			]);
		});
	});
});
