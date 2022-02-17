import { Matcher } from '../Converter';

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
		propertyName: 'identifiers',
		nameInDataPath: 'identifier',
		multiple: true,
	},
];

export default personDomainPartMatcher;
