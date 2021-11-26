export abstract class DataElement {
	name: string;
	repeatId?: string;
}

export interface DataGroup extends DataElement {
	children: (DataAtomic | DataGroup | RecordLink)[];
}

export interface DataAtomic extends DataElement {
	value: string;
}

export interface RecordLink extends DataGroup {
	actionLinks?: ActionLinks;
}

export interface ActionLink {
	requestMethod: string;
	rel: string;
	url: string;
	accept?: string;
	contentType?: string;
	body?: DataGroup;
}

export interface ActionLinks {
	read?: ActionLink;
	update?: ActionLink;
	index?: ActionLink;
	delete?: ActionLink;
}

type Permissions = {
	read?: string[];
	write?: string[];
};

type Record = {
	data: DataGroup;
	permissions?: Permissions;
	actionLinks?: ActionLinks;
};

type RecordWrapper = {
	record: Record;
};

type DataList = {
	fromNo: string;
	data: RecordWrapper[];
	totalNo: string;
	containDataOfType: string;
	toNo: string;
};

export type DataListWrapper = {
	dataList: DataList;
};
