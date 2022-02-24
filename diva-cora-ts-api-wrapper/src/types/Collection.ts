import { Record } from './Record';

export interface MetadataItemCollection extends Record {
	name: string;
	collectionItemReferences: {
		linkedRecordType: string;
		linkedRecordId: string;
	}[];
}

export interface GenericCollectionItem extends Record {
	name: string;
	textId: {
		linkedRecordType: string;
		linkedRecordId: string;
	};
}
