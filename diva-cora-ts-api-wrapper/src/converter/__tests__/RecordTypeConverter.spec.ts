import { createMinimumPersonWithIdAndName } from '../../../testData/personObjectData';
import { DataGroup } from '../../cora-data/CoraData';
import { Person } from '../../types/Person';
import { PersonDomainPart } from '../../types/PersonDomainPart';
import { RecordType } from '../../types/Record';
import convertToObject from '../Converter';
import getMatcherForRecordType from '../definitions';
import personMatcher from '../definitions/PersonDefinitions';
import personDomainPartMatcher from '../definitions/PersonDomainPartDefinitions';
import convertToObjectWithRecordType from '../RecordTypeConverter';

jest.mock('../Converter');
const mockConvertToObject = convertToObject as jest.MockedFunction<
	typeof convertToObject
>;

jest.mock('../definitions');
const mockGetMatcherForRecordType =
	getMatcherForRecordType as jest.MockedFunction<
		typeof getMatcherForRecordType
	>;

const someDataGroup: DataGroup = {
	name: 'someDataGroup',
	children: [{ name: 'someChild', value: 'someValue' }],
};

beforeAll(() => {
	const person = createMinimumPersonWithIdAndName();

	mockConvertToObject.mockReturnValue(person);
	mockGetMatcherForRecordType.mockReturnValue(personMatcher);
});

describe('RecordTypeConverter', () => {
	it('takes dataGroup and recordType', () => {
		convertToObjectWithRecordType(someDataGroup, RecordType.Person);
	});
	it('passes dataGroup to convertToObject', () => {
		convertToObjectWithRecordType(someDataGroup, RecordType.Person);

		expect(mockConvertToObject).toHaveBeenNthCalledWith(
			1,
			someDataGroup,
			expect.any(Object)
		);

		const someOtherDataGroup: DataGroup = {
			name: 'someOtherDataGroup',
			children: [{ name: 'someOtherChild', value: 'someValue' }],
		};

		convertToObjectWithRecordType(someOtherDataGroup, RecordType.Person);

		expect(mockConvertToObject).toHaveBeenNthCalledWith(
			2,
			someOtherDataGroup,
			expect.any(Object)
		);
	});

	it('calls getMatcherForRecordType with recordType', () => {
		convertToObjectWithRecordType(someDataGroup, RecordType.Person);
		expect(mockGetMatcherForRecordType).toHaveBeenLastCalledWith(
			RecordType.Person
		);
		convertToObjectWithRecordType(
			someDataGroup,
			RecordType.PersonDomainPart
		);
		expect(mockGetMatcherForRecordType).toHaveBeenLastCalledWith(
			RecordType.PersonDomainPart
		);
	});

	it('calls convertToObject with matcher returned from getMatcherForRecordType', () => {
		mockGetMatcherForRecordType.mockReturnValueOnce(personMatcher);
		convertToObjectWithRecordType(someDataGroup, RecordType.Person);

		expect(mockConvertToObject).toHaveBeenLastCalledWith(
			expect.any(Object),
			personMatcher
		);

		mockGetMatcherForRecordType.mockReturnValueOnce(
			personDomainPartMatcher
		);
		convertToObjectWithRecordType(
			someDataGroup,
			RecordType.PersonDomainPart
		);

		expect(mockConvertToObject).toHaveBeenLastCalledWith(
			expect.any(Object),
			personDomainPartMatcher
		);
	});

	it('returns person if type was person', () => {
		const person: Person = convertToObjectWithRecordType<Person>(
			someDataGroup,
			RecordType.Person
		);

		expect(person).toBeDefined();
	});

	it('returns personDomainPart if type was personDomainPart', () => {
		const person: PersonDomainPart =
			convertToObjectWithRecordType<PersonDomainPart>(
				someDataGroup,
				RecordType.PersonDomainPart
			);

		expect(person).toBeDefined();
	});
});
