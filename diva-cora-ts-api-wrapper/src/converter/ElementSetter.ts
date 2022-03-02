import { ConverterObject } from './Converter';

export const possiblySetReturnValue = (
	value: string | string[] | {} | undefined,
	fieldName: string,
	required?: boolean,
	multiple?: boolean
): ConverterObject | undefined => {
	const objectToReturn: ConverterObject = {};
	if (fieldName === 'givenName') {
		console.log('in possiblySetReturn');
		console.log(required);
	}

	if (value !== undefined) {
		objectToReturn[fieldName] = value;
		return objectToReturn;
	}

	if (required === undefined || !required) {
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
