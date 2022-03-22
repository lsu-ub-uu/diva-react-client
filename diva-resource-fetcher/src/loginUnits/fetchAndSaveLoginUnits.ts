import saveStringToFile from '../fileHandler';
import fetchLoginUnits from './loginUnitFetcher';

const fetchAndSaveLoginUnits = async (pathToFile: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		if (pathToFile === '') {
			reject(
				new Error('Error when fetching loginUnits. Path to file is empty.')
			);
		}
		fetchLoginUnits()
			.then((loginUnits) => {
				const loginUnitString = JSON.stringify(loginUnits);

				const stringWithPreservedTypes = loginUnitString.replace(
					/{"type":"loginWebRedirect",/g,
					'{type:LoginType.LoginWebRedirect,'
				);

				const stringToWrite = `import { LoginUnitObject, LoginType } from 'diva-cora-ts-api-wrapper';

const loginUnits: LoginUnitObject[] = ${stringWithPreservedTypes};

export default loginUnits;`;

				return saveStringToFile(stringToWrite, pathToFile);
			})
			.then(() => {
				resolve(`Successfully wrote to ${pathToFile}`);
			})
			.catch((error) => {
				reject(error);
			});
	});
};

export default fetchAndSaveLoginUnits;
