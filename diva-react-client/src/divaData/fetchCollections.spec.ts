import fetchAndSaveCollection from './divaCollectionFetcher';
import fetchCollectionsWithBaseDir from './fetchCollections';

jest.mock('./divaCollectionFetcher');
const mockFetchAndSaveCollection =
	fetchAndSaveCollection as jest.MockedFunction<typeof fetchAndSaveCollection>;

beforeAll(() => {
	mockFetchAndSaveCollection.mockResolvedValue(
		'someResultFromFetchAndSaveCollection'
	);
});

describe('fetchCollectionsWithBaseDir', () => {
	it('if no baseDir was given, throws error', async () => {
		expect.assertions(1);

		const expectedError = new Error(
			'Error in fetchCollectionsWithBaseDir. No baseDir given."'
		);

		try {
			await fetchCollectionsWithBaseDir('');
		} catch (error: unknown) {
			const caughtError = <Error>error;

			expect(caughtError).toStrictEqual(expectedError);
		}
	});

	it('if baseDir was given, calls fetchAndSaveCollection with domainCollection', async () => {
		expect.assertions(1);

		await fetchCollectionsWithBaseDir('some/base/dir/');

		expect(fetchAndSaveCollection).toHaveBeenLastCalledWith(
			'domainCollection',
			expect.any(String)
		);
	});

	it('if baseDir was given, calls fetchAndSaveCollection with baseDir and domainCollection.ts', async () => {
		expect.assertions(2);

		await fetchCollectionsWithBaseDir('some/base/dir/');

		expect(fetchAndSaveCollection).toHaveBeenLastCalledWith(
			'domainCollection',
			'some/base/dir/domainCollection.ts'
		);

		await fetchCollectionsWithBaseDir('some/other/base/dir/');

		expect(fetchAndSaveCollection).toHaveBeenLastCalledWith(
			'domainCollection',
			'some/other/base/dir/domainCollection.ts'
		);
	});

	it('if fetchAndSaveCollection rejects, rejects with same error', async () => {
		expect.assertions(1);

		const expectedError = new Error('some Error from fetchAndSaveCollection');
		mockFetchAndSaveCollection.mockRejectedValueOnce(expectedError);

		try {
			await fetchCollectionsWithBaseDir('some/other/base/dir/');
		} catch (error) {
			expect(error).toStrictEqual(expectedError);
		}
	});

	it('if fetchAndSaveCollection resolves, resolves with the same string', async () => {
		expect.assertions(2);

		let expectedString = 'That went well!';
		mockFetchAndSaveCollection.mockResolvedValueOnce(expectedString);

		let result = await fetchCollectionsWithBaseDir('some/other/base/dir/');

		expect(result).toStrictEqual(expectedString);

		expectedString = 'That went well as well!';
		mockFetchAndSaveCollection.mockResolvedValueOnce(expectedString);

		result = await fetchCollectionsWithBaseDir('some/other/base/dir/');

		expect(result).toStrictEqual(expectedString);
	});
});
