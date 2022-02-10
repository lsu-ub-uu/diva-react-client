import { AttributeMatcher } from './Converter';
import { DataAtomic, DataGroup } from './CoraData';
import {
	extractDataGroupFollowingNameInDatas,
	getAllDataAtomicValuesWithNameInData,
} from './CoraDataUtilsWrappers';

// export const getAllChildrenWithNameInData = (
// 	dataGroup: DataGroup,
// 	nameInData: string
// ): (DataGroup | DataAtomic)[] => {
// 	return [];
// };

export const extractAllDataAtomicValuesFollowingNameInDatas = (
	dataGroup: DataGroup,
	nameInDatas: string[]
): string[] => {
	if (!nameInDatas.length || !dataGroup.children.length) {
		return [];
	}

	let finalDataGroup: DataGroup | undefined = dataGroup;
	if (nameInDatas.length > 1) {
		finalDataGroup = getFinalDataGroup(dataGroup, nameInDatas);
		if (finalDataGroup === undefined) {
			return [];
		}
	}

	return getAllDataAtomicValuesWithNameInData(
		finalDataGroup,
		nameInDatas[nameInDatas.length - 1]
	);
};

const getFinalDataGroup = (dataGroup: DataGroup, nameInDatas: string[]) => {
	const dataGroupNameInDatas = nameInDatas.slice(0, -1);

	const finalDataGroup = extractDataGroupFollowingNameInDatas(
		dataGroup,
		dataGroupNameInDatas
	);

	return finalDataGroup;
};

export const extractOneDataAtomicValueFollowingNameInDatas = (
	dataGroup: DataGroup,
	nameInDatas: string[],
	matchingAttributes?: AttributeMatcher[]
): string | undefined => {
	let finalDataGroup: DataGroup | undefined = dataGroup;

	if (nameInDatas.length > 1) {
		finalDataGroup = getFinalDataGroup(dataGroup, nameInDatas);
		if (finalDataGroup === undefined) {
			return undefined;
		}
	}

	return undefined;
};

// export const getDataGroupWithNameInDatas = (
// 	dataGroup: DataGroup,
// 	nameInDatas: string[],
// 	matchingAttributes?: AttributeMatcher[]
// ): DataGroup | undefined => {
// 	return undefined;
// };

export default {
	extractAllDataAtomicValuesFollowingNameInDatas,
	extractOneDataAtomicValueFollowingNameInDatas,
	// getDataGroupWithNameInDatas,
};
