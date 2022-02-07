import { DataGroup } from './CoraData';
import extractDataAtomicValue from './DataAtomicConverter';

const convertToObject = <T>(dataGroup: DataGroup, matchers: Matcher[]) => {
	const objectToReturn: any = {};

	matchers.forEach((matcher) => {
		extractDataAtomicValue(dataGroup, matcher.cora);
	});

	return <T>objectToReturn;
};

// const extractAndSetDataAtomic = (
// 	dataGroup: DataGroup,
// 	matcher: Matcher,
// 	objectToReturn: any
// ) => {
// 	const dataAtomic = <DataAtomic>(
// 		dataGroup.children.find((child) => child.name === matcher.cora)
// 	);

// 	if (dataAtomic !== undefined) {
// 		objectToReturn[matcher.react] = dataAtomic.value;
// 	} else if (matcher.required) {
// 		objectToReturn[matcher.react] = '';
// 	}
// };

export type Matcher = {
	react: string;
	cora: string;
	required?: boolean;
	matcher?: Matcher;
	multiple?: boolean;
	matchingAttributes?: AttributeMatcher[];
};

export type AttributeMatcher = {
	key: string;
	value: string;
};

export default convertToObject;
