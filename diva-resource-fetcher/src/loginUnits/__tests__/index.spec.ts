import fetchLoginUnitsWithBaseDir from '..';
import fetchAndSaveLoginUnits from '../fetchAndSaveLoginUnits';

jest.mock('../fetchAndSaveLoginUnits');
const mockFetchAndSaveLoginUnits =
	fetchAndSaveLoginUnits as jest.MockedFunction<
		typeof fetchAndSaveLoginUnits
	>;

beforeAll(() => {
	mockFetchAndSaveLoginUnits.mockResolvedValue(
		'someResultFromFetchAndSaveLoginUnits'
	);
});

describe('fetchLoginUnitsWithBaseDir', () => {
	it('if no baseDir was given, throws error', async () => {
		expect.assertions(1);

		const expectedError = new Error(
			'Error in fetchCollectionsWithBaseDir. No baseDir given."'
		);

		try {
			await fetchLoginUnitsWithBaseDir('');
		} catch (error: unknown) {
			const caughtError = <Error>error;

			expect(caughtError).toStrictEqual(expectedError);
		}
	});

	it('if baseDir was given, calls fetchAndSaveLoginUnits with baseDir and loginUnits.ts', async () => {
		expect.assertions(2);

		await fetchLoginUnitsWithBaseDir('some/base/dir/');

		expect(mockFetchAndSaveLoginUnits).toHaveBeenLastCalledWith(
			'some/base/dir/loginUnits.ts'
		);

		await fetchLoginUnitsWithBaseDir('some/other/base/dir/');

		expect(mockFetchAndSaveLoginUnits).toHaveBeenLastCalledWith(
			'some/other/base/dir/loginUnits.ts'
		);
	});

	it('if fetchAndSaveLoginUnits rejects, rejects with same error', async () => {
		expect.assertions(1);

		const expectedError = new Error(
			'some Error from fetchAndSaveLoginUnits'
		);
		mockFetchAndSaveLoginUnits.mockRejectedValueOnce(expectedError);

		try {
			await fetchLoginUnitsWithBaseDir('some/other/base/dir/');
		} catch (error) {
			expect(error).toStrictEqual(expectedError);
		}
	});

	it('if fetchAndSaveLoginUnits resolves, resolves with the same string', async () => {
		expect.assertions(2);

		let expectedString = 'That went well!';
		mockFetchAndSaveLoginUnits.mockResolvedValueOnce(expectedString);

		let result = await fetchLoginUnitsWithBaseDir('some/other/base/dir/');

		expect(result).toStrictEqual(expectedString);

		expectedString = 'That went well as well!';
		mockFetchAndSaveLoginUnits.mockResolvedValueOnce(expectedString);

		result = await fetchLoginUnitsWithBaseDir('some/other/base/dir/');

		expect(result).toStrictEqual(expectedString);
	});
});
