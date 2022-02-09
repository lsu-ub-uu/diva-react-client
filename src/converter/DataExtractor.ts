import { AttributeMatcher } from './Converter';
import { DataAtomic, DataGroup } from './CoraData';
import { getFirstDataGroupWithNameInData } from './CoraDataUtils';
import { getAllDataAtomicValuesWithNameInData } from './CoraDataUtilsWrappers';

export const getAllChildrenWithNameInData = (
	dataGroup: DataGroup,
	nameInData: string
): (DataGroup | DataAtomic)[] => {
	return [];
};

export const extractAllDataAtomicValuesFollowingNameInDatas = (
	dataGroup: DataGroup,
	nameInDatas: string[]
): string[] => {
	if (!nameInDatas.length || !dataGroup.children.length) {
		return [];
	}

	if (nameInDatas.length > 1) {
		const nextDataGroup = getFirstDataGroupWithNameInData(
			dataGroup,
			nameInDatas[0]
		);

		if (nextDataGroup === undefined) {
			return [];
		}

		const nextNameInDatas = nameInDatas.slice(1);

		return extractAllDataAtomicValuesFollowingNameInDatas(
			nextDataGroup,
			nextNameInDatas
		);
	}

	return getAllDataAtomicValuesWithNameInData(dataGroup, nameInDatas[0]);
};

export const getFinalDataAtomicValueWithNameInDatas = (
	dataGroup: DataGroup,
	nameInDatas: string[],
	matchingAttributes?: AttributeMatcher[]
): string | undefined => {
	return '';
};

export const getDataGroupWithNameInDatas = (
	dataGroup: DataGroup,
	nameInDatas: string[],
	matchingAttributes?: AttributeMatcher[]
): DataGroup | undefined => {
	return undefined;
};

export default {
	getAllChildrenWithNameInData,
	extractAllDataAtomicValuesFollowingNameInDatas,
	getFinalDataAtomicValueWithNameInDatas,
	getDataGroupWithNameInDatas,
};
