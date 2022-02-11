import { ConverterObject, Matcher } from './Converter';
import { DataGroup } from './CoraData';
import { possiblySetReturnValue } from './ElementSetter';
import { extractAndReturnChildren } from './FieldMatcherExtractor';

const extractWithMatcher = (dataGroup: DataGroup, matcher: Matcher) => {
	const objectToReturn: ConverterObject = {};

	matcher.forEach((fieldMatcher) => {
		const extracted = extractAndReturnChildren(dataGroup, fieldMatcher);
		const partOfAnObject = possiblySetReturnValue(
			extracted,
			fieldMatcher.react
		);

		if (
			partOfAnObject !== undefined &&
			Object.keys(partOfAnObject).length > 0
		) {
			const availableKeys = Object.keys(partOfAnObject);
			objectToReturn[availableKeys[0]] = partOfAnObject[availableKeys[0]];
		}
	});

	return objectToReturn;
};

export default extractWithMatcher;
