import { DataAtomic, DataGroup } from './CoraData';

export function getFirstChildWithNameInData(
	dataGroup: DataGroup,
	nameInData: string
): DataAtomic | DataGroup {
	if (dataGroup.children.length === 0) {
		throw new Error('The DataGroup has no children.');
	}

	const matchingDataElements: (DataAtomic | DataGroup)[] =
		dataGroup.children.filter((child) => {
			return child.name === nameInData;
		});

	if (matchingDataElements.length === 0) {
		throw new Error(
			`The DataGroup has no child with name in data "${nameInData}".`
		);
	}

	return matchingDataElements[0];
}

export default { getFirstChildWithNameInData };
