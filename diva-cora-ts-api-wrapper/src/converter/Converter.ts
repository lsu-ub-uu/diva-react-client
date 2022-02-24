import { DataGroup } from '../cora-data/CoraData';
import extractWithMatcher from './MatcherExtractor';

export type FieldMatcher = {
	propertyName: string;
	nameInDataPath: string;
	required?: boolean;
	nextMatcher?: Matcher;
	multiple?: boolean;
	attributesToMatch?: {
		[key: string]: string;
	};
};

export type Matcher = FieldMatcher[];

export type AttributeMatcher = {
	key: string;
	value: string;
};

export type ConverterObject = {
	[key: string]: ConverterObject | string | {} | string[];
};

const convertToObject = <T>(dataGroup: DataGroup, matcher: Matcher) => {
	const objectToReturn = extractWithMatcher(dataGroup, matcher);

	return <T>(<unknown>objectToReturn);
};

export default convertToObject;
