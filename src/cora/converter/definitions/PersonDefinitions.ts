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

export const personMatcher: Matcher = [
	{
		propertyName: 'id',
		nameInDataPath: 'recordInfo/id',
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
		propertyName: 'recordType',
		nameInDataPath: 'recordInfo/type/linkedRecordId',
		required: true,
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
		propertyName: 'externalURLs',
		nameInDataPath: 'externalURL',
		nextMatcher: ExternalURLMatcher,
		multiple: true,
	},
	{
		propertyName: 'biographySwedish',
		nameInDataPath: 'biographySwedish/biography',
	},
	{
		propertyName: 'biographyEnglish',
		nameInDataPath: 'biographyEnglish/biography',
	},
];

export default personMatcher;
