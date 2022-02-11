import { DataGroup } from './CoraData';
import {
	extractDataGroupFollowingNameInDatas,
	getAllDataAtomicValuesWithNameInData,
	getFirstDataAtomicValueWithNameInData,
} from './CoraDataUtilsWrappers';

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
	nameInDatas: string[]
): string | undefined => {
	let finalDataGroup: DataGroup | undefined = dataGroup;

	if (nameInDatas.length > 1) {
		finalDataGroup = getFinalDataGroup(dataGroup, nameInDatas);
		if (finalDataGroup === undefined) {
			return undefined;
		}
	}
	return getFirstDataAtomicValueWithNameInData(
		finalDataGroup,
		nameInDatas[nameInDatas.length - 1]
	);
};

export default {
	extractAllDataAtomicValuesFollowingNameInDatas,
	extractOneDataAtomicValueFollowingNameInDatas,
};
