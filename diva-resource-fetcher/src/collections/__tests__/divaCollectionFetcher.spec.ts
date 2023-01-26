import fetchCollection from '../collectionFetcher';
import fetchAndSaveCollection from '../divaCollectionFetcher';
import saveStringToFile from '../../fileHandler';
import { serializeMap } from '../../mapHandler';

jest.mock('../collectionFetcher');
const mockFetchCollection = fetchCollection as jest.MockedFunction<
	typeof fetchCollection
>;

jest.mock('../../mapHandler');
const mockSerializeMap = serializeMap as jest.MockedFunction<
	typeof serializeMap
>;

jest.mock('../../fileHandler');
const mockSaveStringToFile = saveStringToFile as jest.MockedFunction<
	typeof saveStringToFile
>;

const someMap = new Map();
someMap.set('someKey', 'someValue');
someMap.set('someKey2', 'someValue2');

const someOtherMap = new Map();
someOtherMap.set('someOtherKey', 'someOtherValue');
someOtherMap.set('someOtherKey2', 'someOtherValue2');
someOtherMap.set('someOtherKey3', 'someOtherValue3');
someOtherMap.set('someOtherKey4', 'someOtherValue4');

const stringifiedMap = '[["someKey","someValue"],["someKey2","someValue2"]]';
const stringifiedMap2 =
	'[["someOtherKey","someOtherValue"],["someOtherKey2","someOtherValue2"],["someOtherKey3","someOtherValue3"],["someOtherKey4","someOtherValue4"]]';

beforeAll(() => {
	mockFetchCollection.mockResolvedValue(someMap);

	mockSerializeMap.mockReturnValue(stringifiedMap);

	mockSaveStringToFile.mockResolvedValue();
});

describe('divaCollectionFetcher', () => {
	describe('fetchAndSaveCollection', () => {
		it('takes collectionId and pathToFile', () => {
			fetchAndSaveCollection('someCollectionId', 'somePathToFile');
		});
		it('if collectionId is empty, rejects with error', async () => {
			expect.assertions(1);

			const expectedError = new Error(
				'Error when fetching collection. CollectionId is empty.'
			);

			try {
				await fetchAndSaveCollection('', 'somePathToFile');
			} catch (error) {
				expect(error).toStrictEqual(expectedError);
			}
		});
		it('if pathToFile is empty, rejects with error', async () => {
			expect.assertions(1);

			const expectedError = new Error(
				'Error when fetching collection. Path to file is empty.'
			);

			try {
				await fetchAndSaveCollection('someCollectionId', '');
			} catch (error) {
				expect(error).toStrictEqual(expectedError);
			}
		});

		it('calls fetchCollection with collectionId', async () => {
			expect.assertions(2);

			await fetchAndSaveCollection('someCollectionId', 'somePathToFile');

			expect(fetchCollection).toHaveBeenLastCalledWith(
				'someCollectionId'
			);

			await fetchAndSaveCollection(
				'someOtherCollectionId',
				'somePathToFile'
			);

			expect(fetchCollection).toHaveBeenLastCalledWith(
				'someOtherCollectionId'
			);
		});

		it('if fetchCollection returns map, calls serializeMap with that map', async () => {
			expect.assertions(2);

			await fetchAndSaveCollection('someCollectionId', 'somePathToFile');

			expect(serializeMap).toHaveBeenLastCalledWith(someMap);

			mockFetchCollection.mockResolvedValueOnce(someOtherMap);
			await fetchAndSaveCollection('someCollectionId', 'somePathToFile');

			expect(serializeMap).toHaveBeenLastCalledWith(someOtherMap);
		});

		it('calls saveStringToFile with path', async () => {
			expect.assertions(2);
			await fetchAndSaveCollection('someCollectionId', 'somePathToFile');

			expect(mockSaveStringToFile).toHaveBeenLastCalledWith(
				expect.any(String),
				'somePathToFile'
			);

			await fetchAndSaveCollection(
				'someCollectionId',
				'someOtherPathToFile'
			);

			expect(mockSaveStringToFile).toHaveBeenLastCalledWith(
				expect.any(String),
				'someOtherPathToFile'
			);
		});

		it('if serializeMap returns string, pass it to saveStringToFile with pre- and suffix', async () => {
			mockSerializeMap.mockReturnValueOnce(stringifiedMap);
			await fetchAndSaveCollection('someCollectionId', 'somePathToFile');

			const expectedString = `const someCollectionId: Iterable<readonly [string, string]> = ${stringifiedMap}
export default someCollectionId;
`;

			expect(mockSaveStringToFile).toHaveBeenLastCalledWith(
				expectedString,
				expect.any(String)
			);

			mockSerializeMap.mockReturnValueOnce(stringifiedMap2);
			await fetchAndSaveCollection(
				'someOtherCollectionId',
				'somePathToFile'
			);

			const expectedString2 = `const someOtherCollectionId: Iterable<readonly [string, string]> = ${stringifiedMap2}
export default someOtherCollectionId;
`;

			expect(mockSaveStringToFile).toHaveBeenLastCalledWith(
				expectedString2,
				expect.any(String)
			);
		});

		it('resolves with "Successfully wrote to pathToFile"', async () => {
			expect.assertions(2);

			mockSaveStringToFile.mockResolvedValueOnce();
			const result = await fetchAndSaveCollection(
				'someCollectionId',
				'somePathToFile'
			);

			expect(result).toStrictEqual(
				'Successfully wrote to somePathToFile'
			);

			mockSaveStringToFile.mockResolvedValueOnce();
			const result2 = await fetchAndSaveCollection(
				'someCollectionId',
				'someOtherPathToFile'
			);

			expect(result2).toStrictEqual(
				'Successfully wrote to someOtherPathToFile'
			);
		});

		it('if saveStringToFile rejects, rejects with same error', async () => {
			expect.assertions(1);

			const expectedError = new Error('some Error from saveStringToFile');
			mockSaveStringToFile.mockRejectedValueOnce(expectedError);

			try {
				await fetchAndSaveCollection(
					'someCollectionId',
					'someOtherPathToFile'
				);
			} catch (error) {
				expect(error).toStrictEqual(expectedError);
			}
		});
	});
});
