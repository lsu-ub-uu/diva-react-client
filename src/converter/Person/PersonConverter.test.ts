import { completePersonDataGroup } from '../../../testData/personDataGroups';
import GenericConverter from '../GenericConverter';
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

// const mockedConverter = GenericConverter as jest.MockedClass<
// 	typeof GenericConverter
// >;

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
		});
	});
});
