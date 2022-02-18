import { RecordType } from '../../types/Record';
import { Matcher } from '../Converter';
import organisationMatcher from './OrganisationDefinitions';
import personMatcher from './PersonDefinitions';
import personDomainPartMatcher from './PersonDomainPartDefinitions';

const recordTypeToMatcher: { [key: string]: Matcher } = {
	person: personMatcher,
	personDomainPart: personDomainPartMatcher,
	organisation: organisationMatcher,
};

const getMatcherForRecordType = (recordType: RecordType): Matcher => {
	return recordTypeToMatcher[recordType];
};

export default getMatcherForRecordType;
