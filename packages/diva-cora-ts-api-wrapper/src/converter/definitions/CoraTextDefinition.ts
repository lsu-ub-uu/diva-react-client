import { Matcher } from '../Converter';

const textMatcher: Matcher = [
	{
		propertyName: 'text',
		nameInDataPath: 'text',
		required: true,
	},
];

export const coraTextMatcher: Matcher = [
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
		propertyName: 'defaultText',
		nameInDataPath: 'textPart',
		required: true,
		nextMatcher: textMatcher,
		attributesToMatch: {
			type: 'default',
			lang: 'sv',
		},
	},
	{
		propertyName: 'alternativeText',
		nameInDataPath: 'textPart',
		nextMatcher: textMatcher,
		attributesToMatch: {
			type: 'alternative',
			lang: 'en',
		},
	},
];

export default coraTextMatcher;
