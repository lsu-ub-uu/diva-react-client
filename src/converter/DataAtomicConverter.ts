/* eslint-disable no-param-reassign */
import { DataAtomic, DataGroup } from './CoraData';

const extractDataAtomicValue = (dataGroup: DataGroup, nameInData: string) => {
	const dataAtomic = extractFirstDataAtomicWithNameInData(
		dataGroup,
		nameInData
	);

	if (dataAtomic !== undefined) {
		return dataAtomic.value;
	}
	return undefined;
};

const extractFirstDataAtomicWithNameInData = (
	dataGroup: DataGroup,
	nameInData: string
) => {
	const dataAtomic = <DataAtomic>(
		dataGroup.children.find((child) => child.name === nameInData)
	);

	return dataAtomic;
};

export default extractDataAtomicValue;
