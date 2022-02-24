import { Matcher } from '../Converter';

const NameMatcher: Matcher = [
	{
		nameInDataPath: 'familyName',
		propertyName: 'familyName',
	},
	{
		nameInDataPath: 'givenName',
		propertyName: 'givenName',
	},
];

const ExternalURLMatcher: Matcher = [
	{
		propertyName: 'URL',
		nameInDataPath: 'URL',
		required: true,
	},
	{
		propertyName: 'linkTitle',
		nameInDataPath: 'linkTitle',
		required: true,
	},
];

const OtherAffiliationMatcher: Matcher = [
	{
		propertyName: 'name',
		nameInDataPath: 'affiliation',
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

export const personMatcher: Matcher = [
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
		propertyName: 'domains',
		nameInDataPath: 'recordInfo/domain',
		multiple: true,
	},
	{
		propertyName: 'authorisedName',
		nameInDataPath: 'authorisedName',
		nextMatcher: NameMatcher,
	},
	{
		propertyName: 'academicTitle',
		nameInDataPath: 'academicTitle',
	},
	{
		propertyName: 'yearOfBirth',
		nameInDataPath: 'yearOfBirth',
	},
	{
		propertyName: 'yearOfDeath',
		nameInDataPath: 'yearOfDeath',
	},
	{
		propertyName: 'emailAddress',
		nameInDataPath: 'emailAddress',
	},
	{
		propertyName: 'alternativeNames',
		nameInDataPath: 'alternativeName',
		multiple: true,
		nextMatcher: NameMatcher,
	},
	{
		propertyName: 'externalURLs',
		nameInDataPath: 'externalURL',
		nextMatcher: ExternalURLMatcher,
		multiple: true,
	},
	{
		propertyName: 'otherAffiliation',
		nameInDataPath: 'otherAffiliation',
		nextMatcher: OtherAffiliationMatcher,
	},
	{
		propertyName: 'orcids',
		nameInDataPath: 'ORCID_ID',
		multiple: true,
	},
	{
		propertyName: 'viafIDs',
		nameInDataPath: 'VIAF_ID',
		multiple: true,
	},
	{
		propertyName: 'librisIDs',
		nameInDataPath: 'Libris_ID',
		multiple: true,
	},
	{
		propertyName: 'biographyEnglish',
		nameInDataPath: 'biographyEnglish/biography',
	},
	{
		propertyName: 'biographySwedish',
		nameInDataPath: 'biographySwedish/biography',
	},
	{
		propertyName: 'personDomainParts',
		nameInDataPath: 'personDomainPart',
		multiple: true,
		nextMatcher: [
			{
				propertyName: 'recordId',
				nameInDataPath: 'linkedRecordId',
				required: true,
			},
		],
	},
];

export default personMatcher;
