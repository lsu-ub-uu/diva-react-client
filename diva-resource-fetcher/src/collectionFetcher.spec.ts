import {
	CoraText,
	GenericCollectionItem,
	getRecordById,
	MetadataItemCollection,
	RecordType,
} from 'diva-cora-ts-api-wrapper';
import fetchCollection from './collectionFetcher';

jest.mock('diva-cora-ts-api-wrapper');

jest.mock('diva-cora-ts-api-wrapper', () => ({
	...jest.requireActual('diva-cora-ts-api-wrapper'),
	getRecordById: jest.fn(),
}));

const mockGetRecordById = getRecordById as jest.MockedFunction<
	typeof getRecordById
>;

const collectionItemReferences = [
	{
		linkedRecordType: 'someLinkedRecordType',
		linkedRecordId: 'collectionItemReferenceId1',
	},
	{
		linkedRecordType: 'someLinkedRecordType',
		linkedRecordId: 'collectionItemReferenceId2',
	},
];

const metadataItemCollection: MetadataItemCollection = {
	collectionItemReferences,
	id: 'someId',
	name: 'someName',
	recordType: 'someRecordType',
};

const genericCollectionItems: GenericCollectionItem[] = [
	{
		id: 'someId1',
		recordType: 'genericCollectionItem',
		name: 'interestingKey1',
		textId: {
			linkedRecordType: 'someRecordType',
			linkedRecordId: 'someCoraTextId1',
		},
	},
	{
		id: 'someId2',
		recordType: 'genericCollectionItem',
		name: 'interestingKey2',
		textId: {
			linkedRecordType: 'someRecordType',
			linkedRecordId: 'someCoraTextId2',
		},
	},
];

const coraTexts: CoraText[] = [
	{
		id: 'someId1',
		defaultText: {
			text: 'someText1',
		},
		recordType: 'coraText',
	},
	{
		id: 'someId2',
		defaultText: {
			text: 'someText2',
		},
		recordType: 'coraText',
	},
];

beforeAll(() => {
	mockGetRecordById.mockResolvedValue(metadataItemCollection);
});

describe('fetchCollection', () => {
	it('fetches a collection', async () => {
		expect.assertions(6);

		mockGetRecordById.mockResolvedValueOnce(metadataItemCollection);
		mockGetRecordById.mockResolvedValueOnce(genericCollectionItems[0]);
		mockGetRecordById.mockResolvedValueOnce(genericCollectionItems[1]);
		mockGetRecordById.mockResolvedValueOnce(coraTexts[0]);
		mockGetRecordById.mockResolvedValueOnce(coraTexts[1]);

		const returned = await fetchCollection('domainCollection');

		expect(mockGetRecordById).toHaveBeenCalledWith(
			RecordType.MetadataItemCollection,
			'domainCollection'
		);

		expect(mockGetRecordById).toHaveBeenCalledWith(
			RecordType.GenericCollectionItem,
			collectionItemReferences[0].linkedRecordId
		);
		expect(mockGetRecordById).toHaveBeenCalledWith(
			RecordType.GenericCollectionItem,
			collectionItemReferences[1].linkedRecordId
		);

		expect(mockGetRecordById).toHaveBeenCalledWith(
			RecordType.CoraText,
			genericCollectionItems[0].textId.linkedRecordId
		);
		expect(mockGetRecordById).toHaveBeenCalledWith(
			RecordType.CoraText,
			genericCollectionItems[1].textId.linkedRecordId
		);

		const expectedReturn = new Map();

		expectedReturn.set('interestingKey1', 'someText1');
		expectedReturn.set('interestingKey2', 'someText2');

		expect(returned).toStrictEqual(expectedReturn);
	});
});
