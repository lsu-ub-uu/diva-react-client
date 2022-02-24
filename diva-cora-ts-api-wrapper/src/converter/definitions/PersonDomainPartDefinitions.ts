import { Matcher } from '../Converter';

const AffiliationMatcher: Matcher = [
	{
		propertyName: 'id',
		nameInDataPath: 'organisationLink/linkedRecordId',
		required: true,
	},
	{
		propertyName: 'fromYear',
		nameInDataPath: 'affiliationFromYear',
	},
	{
		propertyName: 'untilYear',
		nameInDataPath: 'affiliationUntilYear',
	},
];

const personDomainPartMatcher: Matcher = [
	{
		propertyName: 'id',
		nameInDataPath: 'recordInfo/id',
		required: true,
	},
	{
		propertyName: 'recordType',
		nameInDataPath: 'recordInfo/type/linkedRecordId',
		required: true,
	},
	{
		propertyName: 'domain',
		nameInDataPath: 'recordInfo/domain',
		required: true,
	},
	{
		propertyName: 'identifiers',
		nameInDataPath: 'identifier',
		multiple: true,
	},
	{
		propertyName: 'affiliations',
		nameInDataPath: 'affiliation',
		multiple: true,
		nextMatcher: AffiliationMatcher,
	},
];

export default personDomainPartMatcher;
