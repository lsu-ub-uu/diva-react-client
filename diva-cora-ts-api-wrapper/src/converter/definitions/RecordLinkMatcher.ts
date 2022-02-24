import { Matcher } from '../Converter';

const recordLinkMatcher: Matcher = [
	{
		propertyName: 'linkedRecordType',
		nameInDataPath: 'linkedRecordType',
		required: true,
	},
	{
		propertyName: 'linkedRecordId',
		nameInDataPath: 'linkedRecordId',
		required: true,
	},
];

export default recordLinkMatcher;
