import getMatcherForRecordType from '..';
import { RecordType } from '../../../types/Record';
import personMatcher from '../PersonDefinitions';
import personDomainPartMatcher from '../PersonDomainPartDefinitions';

const recordTypes = [RecordType.Person, RecordType.PersonDomainPart];

const matchers = [personMatcher, personDomainPartMatcher];

describe('Definitions', () => {
	describe('getMatcherForRecordType', () => {
		it('takes recordType', () => {
			getMatcherForRecordType(RecordType.Person);
		});

		it('returns correct matcher for recordType', () => {
			recordTypes.forEach((recordType, index) => {
				const returned = getMatcherForRecordType(recordType);
				expect(returned).toStrictEqual(matchers[index]);
			});
		});
	});
});
