import { Attributes, DataGroup } from './CoraData';
import {
	getAllDataAtomicsWithNameInData,
	getFirstDataAtomicWithNameInData,
	getFirstDataGroupWithNameInData,
	getFirstDataGroupWithNameInDataAndAttribues,
} from './CoraDataUtils';

export function getFirstDataAtomicValueWithNameInData(
	dataGroup: DataGroup,
	nameInData: string
): string | undefined {
	const dataAtomic = getFirstDataAtomicWithNameInData(dataGroup, nameInData);

	if (dataAtomic === undefined) {
		return undefined;
	}

	return dataAtomic.value;
}

export function getAllDataAtomicValuesWithNameInData(
	dataGroup: DataGroup,
	nameInData: string
): string[] {
	const dataAtomics = getAllDataAtomicsWithNameInData(dataGroup, nameInData);
	return dataAtomics.map((dataAtomic) => {
		return dataAtomic.value;
	});
}

export const extractFirstDataGroupWithAttributesFollowingNameInDatas = (
	dataGroup: DataGroup,
	nameInDatas: string[],
	attributesToMatch?: Attributes
): DataGroup | undefined => {
	if (nameInDatas.length === 0 || dataGroup.children.length === 0) {
		return undefined;
	}

	const finalDataGroup = getFinalDataGroup(dataGroup, nameInDatas);

	if (finalDataGroup === undefined) {
		return undefined;
	}

	const lastNameInData = nameInDatas[nameInDatas.length - 1];
	return getFirstDataGroupWithNameInDataAndAttribues(
		finalDataGroup,
		lastNameInData,
		attributesToMatch
	);
};

const getFinalDataGroup = (dataGroup: DataGroup, nameInDatas: string[]) => {
	if (nameInDatas.length === 1) {
		return dataGroup;
	}

	const firstNameInDatas = nameInDatas.slice(0, -1);

	return extractDataGroupFollowingNameInDatas(dataGroup, firstNameInDatas);
};

export const extractAllDataGroupsWithAttributesFollowingNameInDatas = (
	dataGroup: DataGroup,
	nameInDatas: string[],
	attributesToMatch?: Attributes
): DataGroup | undefined => {
	if (nameInDatas.length === 0 || dataGroup.children.length === 0) {
		return undefined;
	}

	const finalDataGroup = getFinalDataGroup(dataGroup, nameInDatas);

	if (finalDataGroup === undefined) {
		return undefined;
	}
};

export const extractDataGroupFollowingNameInDatas = (
	dataGroup: DataGroup,
	nameInDatas: string[]
): DataGroup | undefined => {
	if (nameInDatas.length === 0 || dataGroup.children.length === 0) {
		return undefined;
	}

	const nextDataGroup = getFirstDataGroupWithNameInData(
		dataGroup,
		nameInDatas[0]
	);

	if (nameInDatas.length === 1 || nextDataGroup === undefined) {
		return nextDataGroup;
	}

	const nextNameInDatas = nameInDatas.slice(1);
	return extractDataGroupFollowingNameInDatas(nextDataGroup, nextNameInDatas);
};

export default {
	getFirstDataAtomicWithNameInData,
	getAllDataAtomicValuesWithNameInData,
	extractDataGroupFollowingNameInDatas,
	extractFirstDataGroupWithAttributesFollowingNameInDatas,
	extractAllDataGroupsWithAttributesFollowingNameInDatas,
};
