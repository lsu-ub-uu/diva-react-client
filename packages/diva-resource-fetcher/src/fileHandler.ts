import * as fs from 'fs/promises';

const saveStringToFile = async (
	stringToSave: string,
	pathToSaveTo: string
): Promise<void> => {
	return new Promise((resolve, reject) => {
		if (stringToSave === '') {
			reject(new Error('Error when saving to file. String to save is empty.'));
		}
		if (pathToSaveTo === '') {
			reject(new Error('Error when saving to file. Path to save to is empty.'));
		}

		fs.writeFile(pathToSaveTo, stringToSave)
			.then(() => resolve())
			.catch((error) => {
				reject(error);
			});
	});
};

export default saveStringToFile;
