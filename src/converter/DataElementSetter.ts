/* eslint-disable no-param-reassign */
import { Matcher } from './Converter';
import { DataGroup } from './CoraData';
import {
	getAllDataAtomicValuesWithNameInData,
	getDataGroupWithNameInDatas,
	getFinalDataAtomicValueWithNameInDatas,
} from './DataExtractor';

export const extractAndSetChildren = (
	dataGroup: DataGroup,
	matcher: Matcher
): string | string[] | undefined => {
	const nameInDatas = getNameInDatasFromPath(matcher.cora);

	if (matcher.matcher !== undefined) {
		return extractDeeperNestedValues(dataGroup, nameInDatas, matcher);
	}

	return extracAtomicValues(dataGroup, nameInDatas, matcher);
};

const extractDeeperNestedValues = (
	dataGroup: DataGroup,
	nameInDatas: string[],
	matcher: Matcher
) => {
	const finalDataGroup = getDataGroupWithNameInDatas(
		dataGroup,
		nameInDatas,
		matcher.matchingAttributes
	);

	const nextMatcher = <Matcher>matcher.matcher;

	if (finalDataGroup !== undefined) {
		const value = extractAndSetChildren(finalDataGroup, nextMatcher);

		return possiblySetReturnValue(
			value,
			nextMatcher.react,
			nextMatcher.required,
			nextMatcher.multiple
		);
	}

	return undefined;
};

const extracAtomicValues = (
	dataGroup: DataGroup,
	nameInDatas: string[],
	matcher: Matcher
) => {
	if (matcher.multiple) {
		const values = getAllDataAtomicValuesWithNameInData(
			dataGroup,
			nameInDatas,
			matcher.matchingAttributes
		);

		return values;
	}

	const value = getFinalDataAtomicValueWithNameInDatas(
		dataGroup,
		nameInDatas,
		matcher.matchingAttributes
	);

	return value;
};

export const getNameInDatasFromPath = (path: string): string[] => {
	if (path !== '') {
		return path.split('/');
	}

	return [];
};

export const possiblySetReturnValue = (
	value: string | string[] | {} | undefined,
	fieldName: string,
	required?: boolean,
	multiple?: boolean
): any | undefined => {
	const objectToReturn: any = {};
	if (value !== undefined) {
		objectToReturn[fieldName] = value;
		return objectToReturn;
	}

	if (!required) {
		return undefined;
	}

	if (multiple) {
		objectToReturn[fieldName] = [];
	} else {
		objectToReturn[fieldName] = '';
	}

	return objectToReturn;
};

export default { extractAndSetChildren, getNameInDatasFromPath };
