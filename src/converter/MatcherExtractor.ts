import { Matcher } from './Converter';
import { DataGroup } from './CoraData';
import { extractDataGroupFollowingNameInDatas } from './CoraDataUtilsWrappers';
import { possiblySetReturnValue } from './ElementSetter';
import {
	extractAllDataAtomicValuesFollowingNameInDatas,
	extractOneDataAtomicValueFollowingNameInDatas,
} from './RecursiveExtractor';

export const extractAndReturnChildren = (
	dataGroup: DataGroup,
	matcher: Matcher
): string | string[] | Object | undefined => {
	const nameInDatas = getNameInDatasFromPath(matcher.cora);

	if (matcher.nextMatcher !== undefined) {
		return extractDeeperNestedValues(dataGroup, nameInDatas, matcher);
	}

	return extracAtomicValues(dataGroup, nameInDatas, matcher);
};

const extractDeeperNestedValues = (
	dataGroup: DataGroup,
	nameInDatas: string[],
	matcher: Matcher
) => {
	const finalDataGroup = extractDataGroupFollowingNameInDatas(
		dataGroup,
		nameInDatas,
		matcher.matchingAttributes
	);

	const nextMatcher = <Matcher>matcher.nextMatcher;

	if (finalDataGroup === undefined) {
		return undefined;
	}

	const value = extractAndReturnChildren(finalDataGroup, nextMatcher);

	return possiblySetReturnValue(
		value,
		nextMatcher.react,
		nextMatcher.required,
		nextMatcher.multiple
	);
};

const extracAtomicValues = (
	dataGroup: DataGroup,
	nameInDatas: string[],
	matcher: Matcher
) => {
	if (matcher.multiple) {
		const values = extractAllDataAtomicValuesFollowingNameInDatas(
			dataGroup,
			nameInDatas
		);

		return values;
	}

	const value = extractOneDataAtomicValueFollowingNameInDatas(
		dataGroup,
		nameInDatas
	);

	return value;
};

export const getNameInDatasFromPath = (path: string): string[] => {
	if (path !== '') {
		return path.split('/');
	}

	return [];
};

export default {
	extractAndReturnChildren,
	getNameInDatasFromPath,
};
