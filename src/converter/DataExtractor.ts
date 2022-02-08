import { AttributeMatcher } from './Converter';
import { DataAtomic, DataGroup } from './CoraData';

export const getAllChildrenWithNameInData = (
	dataGroup: DataGroup,
	nameInData: string
): (DataGroup | DataAtomic)[] => {
	return [];
};

export const getAllDataAtomicValuesWithNameInData = (
	dataGroup: DataGroup,
	nameInDatas: string[],
	matchingAttributes?: AttributeMatcher[]
): string[] => {
	return [];
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
