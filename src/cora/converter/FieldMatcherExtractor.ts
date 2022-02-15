import { ConverterObject, FieldMatcher, Matcher } from './Converter';
import { DataGroup } from '../cora-data/CoraData';
import {
	extractAllDataGroupsWithAttributesFollowingNameInDatas,
	extractFirstDataGroupWithAttributesFollowingNameInDatas,
} from '../cora-data/CoraDataUtilsWrappers';
import extractWithMatcher from './MatcherExtractor';
import {
	extractAllDataAtomicValuesFollowingNameInDatas,
	extractOneDataAtomicValueFollowingNameInDatas,
} from './RecursiveExtractor';
import { isEqual } from 'lodash';

export const extractAndReturnChildren = (
	dataGroup: DataGroup,
	matcher: FieldMatcher
): string | string[] | undefined | ConverterObject | ConverterObject[] => {
	const nameInDatas = getNameInDatasFromPath(matcher.nameInDataPath);

	if (matcher.nextMatcher !== undefined) {
		return extractDeeperNestedValues(dataGroup, nameInDatas, matcher);
	}

	return extracAtomicValues(dataGroup, nameInDatas, matcher);
};

const extractDeeperNestedValues = (
	dataGroup: DataGroup,
	nameInDatas: string[],
	matcher: FieldMatcher
) => {
	// if multiple
	// extractAllDataGroupsFollowingNameInDatas
	// map over result, and call extractWithMatcher
	// return array containing results from all calls to extractWithMatcher

	if (matcher.multiple) {
		const matchingDataGroups =
			extractAllDataGroupsWithAttributesFollowingNameInDatas(
				dataGroup,
				nameInDatas,
				matcher.attributesToMatch
			);

		if (matchingDataGroups === undefined || matchingDataGroups.length === 0) {
			return undefined;
		}

		const nextMatcher = <Matcher>matcher.nextMatcher;

		const extracted = matchingDataGroups.map((matchingDataGroup) => {
			return extractWithMatcher(matchingDataGroup, nextMatcher);
		});

		const filtered = extracted.filter((element) => {
			return !isEqual(element, {});
		});

		return filtered;
	}

	const finalDataGroup =
		extractFirstDataGroupWithAttributesFollowingNameInDatas(
			dataGroup,
			nameInDatas,
			matcher.attributesToMatch
		);

	const nextMatcher = <Matcher>matcher.nextMatcher;

	if (finalDataGroup === undefined) {
		return undefined;
	}

	return extractWithMatcher(finalDataGroup, nextMatcher);
};

const extracAtomicValues = (
	dataGroup: DataGroup,
	nameInDatas: string[],
	matcher: FieldMatcher
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
