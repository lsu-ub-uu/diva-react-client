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
	nameInData: string,
	matchingAttributes?: AttributeMatcher[]
): string[] => {
	return [];
};
