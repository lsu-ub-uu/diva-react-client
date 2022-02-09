import { DataGroup } from './CoraData';
import {
	getAllDataAtomicsWithNameInData,
	getFirstDataAtomicWithNameInData,
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

export default {
	getFirstDataAtomicWithNameInData,
	getAllDataAtomicValuesWithNameInData,
};
