import { Attributes, DataGroup } from './CoraData';
import {
	getAllDataAtomicsWithNameInData,
	getFirstDataAtomicWithNameInData,
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

export const extractDataGroupFollowingNameInDatas = (
	dataGroup: DataGroup,
	nameInDatas: string[],
	attributesToMatch?: Attributes
): DataGroup | undefined => {
	if (nameInDatas.length === 0 || dataGroup.children.length === 0) {
		return undefined;
	}

	let nextDataGroup;
	if (nameInDatas.length === 1) {
		nextDataGroup = getFirstDataGroupWithNameInDataAndAttribues(
			dataGroup,
			nameInDatas[0],
			attributesToMatch
		);
	} else {
		nextDataGroup = getFirstDataGroupWithNameInDataAndAttribues(
			dataGroup,
			nameInDatas[0]
		);
	}

	if (nameInDatas.length === 1 || nextDataGroup === undefined) {
		return nextDataGroup;
	}

	const nextNameInDatas = nameInDatas.slice(1);
	return extractDataGroupFollowingNameInDatas(
		nextDataGroup,
		nextNameInDatas,
		attributesToMatch
	);
};

export default {
	getFirstDataAtomicWithNameInData,
	getAllDataAtomicValuesWithNameInData,
	extractDataGroupFollowingNameInDatas,
};
