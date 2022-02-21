import { getRecordById } from '../api/api';
import {
	GenericCollectionItem,
	MetadataItemCollection,
} from '../types/Collection';
import { CoraText } from '../types/CoraText';
import { RecordType } from '../types/Record';

const fetchCollection = async (id: string) => {
	const miCollection = await getRecordById<MetadataItemCollection>(
		RecordType.MetadataItemCollection,
		id
	);

	const collectionItems: GenericCollectionItem[] = await Promise.all(
		miCollection.collectionItemReferences.map(async (itemReference) => {
			return getRecordById<GenericCollectionItem>(
				RecordType.GenericCollectionItem,
				itemReference.linkedRecordId
			);
		})
	);

	const collection = new Map();

	await Promise.all(
		collectionItems.map(async (collectionItem) => {
			const coraText = await getRecordById<CoraText>(
				RecordType.CoraText,
				collectionItem.textId.linkedRecordId
			);

			collection.set(collectionItem.name, coraText.defaultText.text);
		})
	);

	return collection;
};

export const fetchCollectionItem = async (
	id: string
): Promise<GenericCollectionItem> => {
	return getRecordById(RecordType.GenericCollectionItem, id);
};

export default fetchCollection;
