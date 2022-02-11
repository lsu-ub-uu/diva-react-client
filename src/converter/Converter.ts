import { DataGroup } from './CoraData';
import extractWithMatcher from './MatcherExtractor';

export type FieldMatcher = {
	react: string;
	cora: string;
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

const convertToObject = <T>(dataGroup: DataGroup, matchers: FieldMatcher[]) => {
	const objectToReturn = extractWithMatcher(dataGroup, matchers);

	return <T>(<unknown>objectToReturn);
};

export default convertToObject;
