import getMatcherForRecordType from '.';
import SupportedRecordType from '../../types/RecordTypes';
import personMatcher from './PersonDefinitions';
import personDomainPartMatcher from './PersonDomainPartDefinitions';

const recordTypes = [
	SupportedRecordType.Person,
	SupportedRecordType.PersonDomainPart,
];

const matchers = [personMatcher, personDomainPartMatcher];

describe('Definitions', () => {
	describe('getMatcherForRecordType', () => {
		it('takes recordType', () => {
			getMatcherForRecordType(SupportedRecordType.Person);
		});

		it('returns correct matcher for recordType', () => {
			recordTypes.forEach((recordType, index) => {
				const returned = getMatcherForRecordType(recordType);
				expect(returned).toStrictEqual(matchers[index]);
			});
		});
	});
});
