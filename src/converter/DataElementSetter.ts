/* eslint-disable no-param-reassign */
import { Matcher } from './Converter';
import { DataGroup } from './CoraData';
import extractDataAtomicValue from './DataAtomicConverter';
import { getAllDataAtomicValuesWithNameInData } from './DataExtractor';

const extractAndSetChildren = (
	dataGroup: DataGroup,
	matcher: Matcher,
	objectToSet: any
) => {
	if (matcher.multiple) {
		const values = getAllDataAtomicValuesWithNameInData(
			dataGroup,
			matcher.cora,
			matcher.matchingAttributes
		);

		if (matcher.required || values.length) {
			objectToSet[matcher.react] = values;
		}
	} else {
		const value = extractDataAtomicValue(dataGroup, matcher.cora);

		if (value !== undefined) {
			objectToSet[matcher.react] = value;
		} else if (matcher.required) {
			objectToSet[matcher.react] = '';
		}
	}
};

export default extractAndSetChildren;
