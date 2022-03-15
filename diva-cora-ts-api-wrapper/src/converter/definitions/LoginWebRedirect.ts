import { Matcher } from '../Converter';
import recordInfoMatcher from './RecordInfo';

export const loginWebRedirectMatcher: Matcher = [
	...recordInfoMatcher,
	{
		propertyName: 'url',
		required: true,
		nameInDataPath: 'url',
	},
];

export default loginWebRedirectMatcher;
