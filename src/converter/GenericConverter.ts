import { DataAtomic, DataGroup } from './CoraData';

class GenericConverter {
	multipleDefinition: string[];

	constructor(multipleDefinition: string[]) {
		this.multipleDefinition = multipleDefinition;
	}

	convertToGenericObject<T>(dataGroup: DataGroup) {
		const object: any = {};

		object[dataGroup.name] = this.convertDataGroup(dataGroup);

		const objectToReturn: T = <T>object;

		return objectToReturn;
	}

	convertDataGroup(dataGroup: DataGroup) {
		const object: any = {};
		const uniqueNameInDatas = getUniqueNameInDatas(dataGroup.children);

		uniqueNameInDatas.forEach((nameInData) => {
			if (this.canBeMultiple(nameInData)) {
				object[nameInData] = [];
			}
		});

		dataGroup.children.forEach((child) => {
			if (this.canBeMultiple(child.name)) {
				object[child.name].push(this.convertDataElement(child));
			} else {
				object[child.name] = this.convertDataElement(child);
			}
		});

		return object;
	}

	canBeMultiple(key: string): boolean {
		return this.multipleDefinition.includes(key);
	}

	convertDataElement(element: Object) {
		if (Object.hasOwnProperty.call(element, 'children')) {
			const dataGroup = <DataGroup>element;

			return this.convertDataGroup(dataGroup);
		}
		const dataAtomic = <DataAtomic>element;

		return convertDataAtomic(dataAtomic);
	}
}
function getUniqueNameInDatas(children: (DataGroup | DataAtomic)[]): string[] {
	return [...new Set(children.map((item) => item.name))];
}

function convertDataAtomic(dataAtomic: DataAtomic) {
	const { value } = dataAtomic;
	return value;
}

export default GenericConverter;
