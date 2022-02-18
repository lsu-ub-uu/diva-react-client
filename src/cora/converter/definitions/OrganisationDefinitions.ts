import { Matcher } from '../Converter';

const organisationMatcher: Matcher = [
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
		propertyName: 'name',
		nameInDataPath: 'organisationName/name',
		required: true,
	},
	{
		propertyName: 'alternativeName',
		nameInDataPath: 'organisationAlternativeName/name',
		required: true,
	},
];

export default organisationMatcher;
