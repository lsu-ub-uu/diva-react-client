/* eslint-disable no-param-reassign */
import { Matcher } from './Converter';
import { DataAtomic, DataGroup } from './CoraData';

const extractAndSetDataAtomic = (
	dataGroup: DataGroup,
	matcher: Matcher,
	objectToReturn: any
) => {
	const dataAtomic = <DataAtomic>(
		dataGroup.children.find((child) => child.name === matcher.cora)
	);

	if (dataAtomic !== undefined) {
		objectToReturn[matcher.react] = dataAtomic.value;
	} else if (matcher.required) {
		objectToReturn[matcher.react] = '';
	}
};

export default extractAndSetDataAtomic;
