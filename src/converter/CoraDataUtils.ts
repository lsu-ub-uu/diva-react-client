import { DataAtomic, DataGroup } from './CoraData';

export function getFirstChildWithNameInData(
	dataGroup: DataGroup,
	nameInData: string
): DataAtomic | DataGroup | null {
	if (dataGroup.children.length === 0) {
		return null;
	}

	const matchingDataElements = getAllChildrenWithNameInData(
		dataGroup,
		nameInData
	);

	if (matchingDataElements.length === 0) {
		return null;
	}

	return matchingDataElements[0];
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

export default { getFirstChildWithNameInData };
