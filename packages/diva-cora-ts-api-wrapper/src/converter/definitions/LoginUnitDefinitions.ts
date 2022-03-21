import { Matcher } from '../Converter';
import recordInfoMatcher from './RecordInfo';

const loginInfoMatcher: Matcher = [
	{
		propertyName: 'loginType',
		nameInDataPath: 'login/linkedRecordType',
		required: true,
	},
	{
		propertyName: 'loginName',
		nameInDataPath: 'login/linkedRecordId',
		required: true,
	},
	{
		propertyName: 'loginDescriptionName',
		nameInDataPath: 'loginDescription/linkedRecordId',
		required: true,
	},
];

export const loginUnitMatcher: Matcher = [
	...recordInfoMatcher,
	{
		propertyName: 'loginInfo',
		required: true,
		nameInDataPath: 'loginInfo',
		nextMatcher: loginInfoMatcher,
	},
];

export default loginUnitMatcher;
