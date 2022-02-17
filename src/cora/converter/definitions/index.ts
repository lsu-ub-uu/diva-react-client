import { RecordType } from '../../types/Record';
import { Matcher } from '../Converter';
import personMatcher from './PersonDefinitions';
import personDomainPartMatcher from './PersonDomainPartDefinitions';

const recordTypeToMatcher: { [key: string]: Matcher } = {
	person: personMatcher,
	personDomainPart: personDomainPartMatcher,
};

const getMatcherForRecordType = (recordType: RecordType): Matcher => {
	return recordTypeToMatcher[recordType];
};

export default getMatcherForRecordType;
