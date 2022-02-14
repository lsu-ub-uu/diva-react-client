import { isEqual } from 'lodash';
import { Attributes, DataAtomic, DataGroup } from './CoraData';

export function getFirstChildWithNameInData(
	dataGroup: DataGroup,
	nameInData: string
): DataAtomic | DataGroup | null {
	if (dataGroup.children.length === 0) {
		return null;
	}

	const matchingChild = dataGroup.children.find((child) => {
		return child.name === nameInData;
	});

	if (matchingChild === undefined) {
		return null;
	}

	return matchingChild;
}

export function getAllChildrenWithNameInData(
	dataGroup: DataGroup,
	nameInData: string
): (DataAtomic | DataGroup)[] {
	const childrenToReturn = dataGroup.children.filter((child) => {
		return child.name === nameInData;
	});

	return childrenToReturn;
}

export function getFirstDataAtomicWithNameInData(
	dataGroup: DataGroup,
	nameInData: string
): DataAtomic | undefined {
	if (dataGroup.children.length === 0) {
		return undefined;
	}

	const dataAtomics = <DataAtomic[]>dataGroup.children.filter((child) => {
		return Object.prototype.hasOwnProperty.call(child, 'value');
	});

	const firstMatchingDataAtomic = dataAtomics.find((dataAtomic) => {
		return dataAtomic.name === nameInData;
	});

	return firstMatchingDataAtomic;
}

export function getAllDataAtomicsWithNameInData(
	dataGroup: DataGroup,
	nameInData: string
): DataAtomic[] {
	const dataAtomics = <DataAtomic[]>dataGroup.children.filter((child) => {
		return Object.prototype.hasOwnProperty.call(child, 'value');
	});

	const matchingDataAtomics = dataAtomics.filter((dataAtomic) => {
		return dataAtomic.name === nameInData;
	});

	return matchingDataAtomics;
}

export function getFirstDataGroupWithNameInData(
	dataGroup: DataGroup,
	nameInData: string
): DataGroup | undefined {
	const dataGroups = <DataGroup[]>dataGroup.children.filter((child) => {
		return Object.prototype.hasOwnProperty.call(child, 'children');
	});

	const firstMatchingDataGroup = dataGroups.find((child) => {
		return child.name === nameInData;
	});

	return firstMatchingDataGroup;
}

export function getFirstDataGroupWithNameInDataAndAttribues(
	dataGroup: DataGroup,
	nameInData: string,
	attributesToMatch?: Attributes
): DataGroup | undefined {
	const dataGroups = <DataGroup[]>dataGroup.children.filter((child) => {
		return Object.prototype.hasOwnProperty.call(child, 'children');
	});

	const firstMatchingDataGroup = dataGroups.find((child) => {
		const matchingNameInData = child.name === nameInData;
		let matchingAttributes = false;
		if (attributesToMatch === undefined && child.attributes === undefined) {
			return matchingNameInData;
		}
		if (attributesToMatch !== undefined && child.attributes !== undefined) {
			matchingAttributes = isEqual(attributesToMatch, child.attributes);
		}

		return matchingAttributes && matchingNameInData;
	});

	return firstMatchingDataGroup;
}

export default {
	getFirstChildWithNameInData,
	getAllChildrenWithNameInData,
	getFirstDataAtomicWithNameInData,
	getAllDataAtomicsWithNameInData,
	getFirstDataGroupWithNameInData,
	getFirstDataGroupWithNameInDataAndAttribues,
};
