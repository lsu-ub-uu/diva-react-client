import fs from 'fs/promises';
import saveStringToFile from './fileHandler';

jest.mock('fs/promises');

const mockWriteFile = fs.writeFile as jest.MockedFunction<typeof fs.writeFile>;

beforeAll(() => {
	mockWriteFile.mockResolvedValue();
});

describe('fileHandler', () => {
	describe('saveStringToFile', () => {
		it('takes a stringToSave and a pathToSaveTo', () => {
			saveStringToFile('someString', 'somePath');
		});
		it('takes a stringToSave is empty, throws error', async () => {
			expect.assertions(1);

			const error = new Error(
				'Error when saving to file. String to save is empty.'
			);

			try {
				await saveStringToFile('', 'somePath');
			} catch (unknownError: unknown) {
				const caughtError = <Error>unknownError;

				expect(caughtError).toStrictEqual(error);
			}
		});
		it('takes a pathToSaveTo is empty, throws error', async () => {
			expect.assertions(1);

			const error = new Error(
				'Error when saving to file. Path to save to is empty.'
			);

			try {
				await saveStringToFile('someString', '');
			} catch (unknownError: unknown) {
				const caughtError = <Error>unknownError;

				expect(caughtError).toStrictEqual(error);
			}
		});

		it('calls fs.writeFile with path and string', async () => {
			await saveStringToFile('someString', 'somePath');

			expect(mockWriteFile).toHaveBeenLastCalledWith('somePath', 'someString');

			await saveStringToFile('someOtherString', 'someOtherPath');

			expect(mockWriteFile).toHaveBeenLastCalledWith(
				'someOtherPath',
				'someOtherString'
			);
		});

		it('throws error if fs.writeFile throws', async () => {
			const expectedError = new Error('Some Error from writeFile');
			mockWriteFile.mockRejectedValueOnce(expectedError);

			expect.assertions(2);

			try {
				await saveStringToFile('someString', 'somePath');
			} catch (error: unknown) {
				const castError: Error = <Error>error;
				expect(mockWriteFile).toHaveBeenCalledTimes(1);
				expect(castError.message).toStrictEqual('Some Error from writeFile');
			}
		});
	});
});
