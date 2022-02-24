export type Record = {
	id: string;
	recordType: string;
};

export enum RecordType {
	Person = 'person',
	PersonDomainPart = 'personDomainPart',
	Organisation = 'organisation',
	MetadataItemCollection = 'metadataItemCollection',
	GenericCollectionItem = 'genericCollectionItem',
	CoraText = 'coraText',
}
