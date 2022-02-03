import { completePersonDataGroup } from '../../../testData/personTestData';
import Name from '../../control/Name';
import Person from '../../control/Person';
import GenericConverter from '../GenericConverter';
import createPersonFromPersonObject from './createPersonFromPersonObject';
import convertPersonDataGroupToPerson from './PersonConverter';
import { personMultipleDefinition, PersonObject } from './PersonDefinitions';

const mockConvertToGenericObject = jest.fn();

jest.mock('../GenericConverter', () => {
	return jest.fn(() => {
		return {
			convertToGenericObject: mockConvertToGenericObject,
		};
	});
});

jest.mock('./PersonDefinitions');

jest.mock('./createPersonFromPersonObject');
const mockCreatePersonFromPersonObject =
	createPersonFromPersonObject as jest.MockedFunction<
		typeof createPersonFromPersonObject
	>;

describe('PersonConverter', () => {
	describe('has function convertPersonDataGroupToPerson', () => {
		it('takes a dataGroup as argument', () => {
			convertPersonDataGroupToPerson(completePersonDataGroup);
		});

		it('creates a new GenericConverter with personMultipleDefinition', () => {
			convertPersonDataGroupToPerson(completePersonDataGroup);

			expect(GenericConverter).toHaveBeenCalledTimes(1);
			expect(GenericConverter).toHaveBeenLastCalledWith(
				personMultipleDefinition
			);
		});

		it("should call converter's convertToGenericObject with PersonObject as type and dataGroup", () => {
			convertPersonDataGroupToPerson(completePersonDataGroup);

			expect(mockConvertToGenericObject).toHaveBeenCalledTimes(1);
			expect(mockConvertToGenericObject).toHaveBeenLastCalledWith(
				completePersonDataGroup
			);
		});

		it('should call createPersonFromPersonObject with returned personObject from convertToGenericObject', () => {
			const personObject: PersonObject = {
				person: {
					authorisedName: {
						familyName: 'someFamilyName',
						givenName: 'someGivenName',
					},
					recordInfo: {
						id: 'someId',
					},
				},
			};
			mockConvertToGenericObject.mockReturnValueOnce(personObject);
			convertPersonDataGroupToPerson(completePersonDataGroup);

			expect(createPersonFromPersonObject).toHaveBeenCalledTimes(1);
			expect(createPersonFromPersonObject).toHaveBeenLastCalledWith(
				personObject
			);
		});

		it('should return person that was returned from createPersonFromPersonObject', () => {
			const personReturnedFromCreatePersonFromPersonObject = new Person(
				'someString',
				new Name('Foo', 'bar')
			);
			mockCreatePersonFromPersonObject.mockReturnValueOnce(
				personReturnedFromCreatePersonFromPersonObject
			);

			const person = convertPersonDataGroupToPerson(completePersonDataGroup);

			expect(person).toStrictEqual(
				personReturnedFromCreatePersonFromPersonObject
			);
		});
	});
});
