import { ConverterObject } from './Converter';

export const possiblySetReturnValue = (
	value: string | string[] | {} | undefined,
	fieldName: string,
	required?: boolean,
	multiple?: boolean
): ConverterObject | undefined => {
	const objectToReturn: ConverterObject = {};
	if (value !== undefined) {
		objectToReturn[fieldName] = value;
		return objectToReturn;
	}

	if (!required) {
		return undefined;
	}

	if (multiple) {
		objectToReturn[fieldName] = [];
	} else {
		objectToReturn[fieldName] = '';
	}

	return objectToReturn;
};

export default { possiblySetReturnValue };
