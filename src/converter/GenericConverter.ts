import { DataAtomic, DataGroup } from './CoraData';

export type PersonObject = {
	person: [
		{
			recordInfo: [
				{
					id: string[];
				}
			];
			authorisedName: [
				{
					familyName: string[];
					givenName: string[];
				}
			];
			academicTitle?: string[];
		}
	];
};

export function convertToGenericObject<T>(dataGroup: DataGroup) {
	const object: any = {};

	object[dataGroup.name] = [convertDataGroup(dataGroup)];

	const objectToReturn: T = <T>object;

	return objectToReturn;
}

function convertDataGroup(dataGroup: DataGroup) {
	const object: any = {};
	const uniqueNameInDatas = getUniqueNameInDatas(dataGroup.children);

	uniqueNameInDatas.forEach((nameInData) => {
		object[nameInData] = [];
	});

	dataGroup.children.forEach((child) => {
		object[child.name].push(convertDataElement(child));
	});

	return object;
}

function getUniqueNameInDatas(children: (DataGroup | DataAtomic)[]): string[] {
	return [...new Set(children.map((item) => item.name))];
}

function convertDataElement(element: Object) {
	if (Object.hasOwnProperty.call(element, 'children')) {
		const dataGroup = <DataGroup>element;

		return convertDataGroup(dataGroup);
	}
	const dataAtomic = <DataAtomic>element;

	return convertDataAtomic(dataAtomic);
}

function convertDataAtomic(dataAtomic: DataAtomic) {
	const { value } = dataAtomic;
	return value;
}
