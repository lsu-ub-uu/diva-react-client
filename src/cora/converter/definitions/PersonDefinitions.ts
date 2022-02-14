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
];

export default personMatcher;
