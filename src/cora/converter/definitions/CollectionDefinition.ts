import { Matcher } from '../Converter';
import recordLinkMatcher from './RecordLinkMatcher';

export const collectionMatcher: Matcher = [
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
		nameInDataPath: 'nameInData',
		required: true,
	},
	{
		propertyName: 'collectionItemReferences',
		nameInDataPath: 'collectionItemReferences/ref',
		nextMatcher: recordLinkMatcher,
		multiple: true,
		required: true,
	},
];

export const genericCollectionItemMatcher: Matcher = [
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
		nameInDataPath: 'nameInData',
		required: true,
	},
	{
		propertyName: 'textId',
		nameInDataPath: 'textId',
		required: true,
		nextMatcher: recordLinkMatcher,
	},
];

export default collectionMatcher;
