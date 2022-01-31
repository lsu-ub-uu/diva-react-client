import { DataAtomic, DataGroup } from './CoraData';

export function getFirstChildWithNameInData(
	dataGroup: DataGroup,
	nameInData: string
): DataAtomic | DataGroup | null {
	if (dataGroup.children.length === 0) {
		return null;
	}

	const matchingDataElements: (DataAtomic | DataGroup)[] =
		dataGroup.children.filter((child) => {
			return child.name === nameInData;
		});

	if (matchingDataElements.length === 0) {
		return null;
	}

	return matchingDataElements[0];
}

export default { getFirstChildWithNameInData };
