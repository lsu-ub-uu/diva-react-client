import { DataGroup } from './CoraData';
import { possiblySetReturnValue } from './ElementSetter';
import { extractAndReturnChildren } from './MatcherExtractor';

export type Matcher = {
	react: string;
	cora: string;
	required?: boolean;
	nextMatcher?: Matcher;
	multiple?: boolean;
	matchingAttributes?: AttributeMatcher[];
};

export type AttributeMatcher = {
	key: string;
	value: string;
};

export type ConverterObject = {
	[key: string]: ConverterObject | string | {} | string[];
};

const convertToObject = <T>(dataGroup: DataGroup, matchers: Matcher[]) => {
	const objectToReturn: ConverterObject = {};

	matchers.forEach((matcher) => {
		const extracted = extractAndReturnChildren(dataGroup, matcher);
		const partOfAnObject = possiblySetReturnValue(extracted, matcher.react);

		if (
			partOfAnObject !== undefined &&
			Object.keys(partOfAnObject).length > 0
		) {
			const availableKeys = Object.keys(partOfAnObject);
			objectToReturn[availableKeys[0]] = partOfAnObject[availableKeys[0]];
		}
	});

	return <T>(<unknown>objectToReturn);
};

export default convertToObject;
