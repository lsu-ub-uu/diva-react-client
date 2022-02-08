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
	if (!nameInDatas.length || !dataGroup.children.length) {
		return [];
	}

	const matchingChildren = dataGroup.children.filter((child) => {
		return child.name === 'someInterestingNameInData';
	});

	const matchingDataAtomics = <DataAtomic[]>matchingChildren.filter((child) => {
		return Object.prototype.hasOwnProperty.call(child, 'value');
	});

	const values = matchingDataAtomics.map((child) => {
		return child.value;
	});

	return values;
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
