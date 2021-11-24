export abstract class DataElement {
	name: string;
}

export interface DataGroup extends DataElement {
	children: (DataAtomic | DataGroup)[];
}

export interface DataAtomic extends DataElement {
	value: string;
}
