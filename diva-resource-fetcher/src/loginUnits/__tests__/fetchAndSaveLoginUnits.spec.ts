import { LoginType } from 'diva-cora-ts-api-wrapper';
import saveStringToFile from '../../fileHandler';
import fetchAndSaveLoginUnits from '../fetchAndSaveLoginUnits';
import fetchLoginUnits from '../loginUnitFetcher';

jest.mock('../loginUnitFetcher');
const mockFetchLoginUnits = fetchLoginUnits as jest.MockedFunction<
	typeof fetchLoginUnits
>;

jest.mock('../../fileHandler');
const mockSaveStringToFile = saveStringToFile as jest.MockedFunction<
	typeof saveStringToFile
>;

beforeAll(() => {
	mockFetchLoginUnits.mockResolvedValue([
		{
			type: LoginType.LoginWebRedirect,
			url: 'someurl',
			displayTextEn: 'displayTextEn',
			displayTextSv: 'displayTextSv',
		},
	]);
	mockSaveStringToFile.mockResolvedValue();
});

describe('fetchAndSaveLoginUnits', () => {
	it('takes pathToFile', () => {
		fetchAndSaveLoginUnits('somePathToFile');
	});

	it('if pathToFile is empty, rejects with error', async () => {
		expect.assertions(1);

		const expectedError = new Error(
			'Error when fetching loginUnits. Path to file is empty.'
		);

		try {
			await fetchAndSaveLoginUnits('');
		} catch (error) {
			expect(error).toStrictEqual(expectedError);
		}
	});

	it('calls fetchLoginUnits', async () => {
		expect.assertions(1);

		await fetchAndSaveLoginUnits('somePathToFile');

		expect(mockFetchLoginUnits).toHaveBeenCalledTimes(1);
	});

	it('calls saveStringToFile with path', async () => {
		expect.assertions(2);
		await fetchAndSaveLoginUnits('somePathToFile');

		expect(mockSaveStringToFile).toHaveBeenLastCalledWith(
			expect.any(String),
			'somePathToFile'
		);

		await fetchAndSaveLoginUnits('someOtherPathToFile');

		expect(mockSaveStringToFile).toHaveBeenLastCalledWith(
			expect.any(String),
			'someOtherPathToFile'
		);
	});

	it('if fetchLoginUnits returns array, pass it as JSON.stringify() to saveStringToFile with pre- and suffix', async () => {
		const loginUnits = [
			{
				type: LoginType.LoginWebRedirect,
				url: 'someurl1',
				displayTextEn: 'displayTextEn1',
				displayTextSv: 'displayTextSv1',
			},
			{
				type: LoginType.LoginWebRedirect,
				url: 'someurl2',
				displayTextEn: 'displayTextEn2',
				displayTextSv: 'displayTextSv2',
			},
		];

		mockFetchLoginUnits.mockResolvedValueOnce(loginUnits);

		await fetchAndSaveLoginUnits('somePathToFile');

		const loginUnitString = JSON.stringify(loginUnits);

		const stringWithPreservedTypes = loginUnitString.replace(
			/{"type":"loginWebRedirect",/g,
			'{type:LoginType.LoginWebRedirect,'
		);

		const expectedString = `import { LoginUnitObject, LoginType } from 'diva-cora-ts-api-wrapper';

export const loginUnits: LoginUnitObject[] = ${stringWithPreservedTypes};

export default loginUnits;`;

		expect(mockSaveStringToFile).toHaveBeenLastCalledWith(
			expectedString,
			expect.any(String)
		);

		const loginUnits2 = [
			{
				type: LoginType.LoginWebRedirect,
				url: 'someurl4',
				displayTextEn: 'displayTextEn4',
				displayTextSv: 'displayTextSv4',
			},
		];

		mockFetchLoginUnits.mockResolvedValueOnce(loginUnits2);

		await fetchAndSaveLoginUnits('somePathToFile');

		const loginUnitString2 = JSON.stringify(loginUnits2);

		const stringWithPreservedTypes2 = loginUnitString2.replace(
			/{"type":"loginWebRedirect",/g,
			'{type:LoginType.LoginWebRedirect,'
		);

		const expectedString2 = `import { LoginUnitObject, LoginType } from 'diva-cora-ts-api-wrapper';

export const loginUnits: LoginUnitObject[] = ${stringWithPreservedTypes2};

export default loginUnits;`;

		expect(mockSaveStringToFile).toHaveBeenLastCalledWith(
			expectedString2,
			expect.any(String)
		);
	});

	it('resolves with "Successfully wrote to pathToFile"', async () => {
		expect.assertions(2);

		mockSaveStringToFile.mockResolvedValueOnce();
		const result = await fetchAndSaveLoginUnits('somePathToFile');

		expect(result).toStrictEqual('Successfully wrote to somePathToFile');

		mockSaveStringToFile.mockResolvedValueOnce();
		const result2 = await fetchAndSaveLoginUnits('someOtherPathToFile');

		expect(result2).toStrictEqual(
			'Successfully wrote to someOtherPathToFile'
		);
	});

	it('if saveStringToFile rejects, rejects with same error', async () => {
		expect.assertions(1);

		const expectedError = new Error('some Error from saveStringToFile');
		mockSaveStringToFile.mockRejectedValueOnce(expectedError);

		try {
			await fetchAndSaveLoginUnits('somePathToFile');
		} catch (error) {
			expect(error).toStrictEqual(expectedError);
		}
	});
});
