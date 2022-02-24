import fetchCollection from './collectionFetcher';
import saveStringToFile from './fileHandler';
import { serializeMap } from './mapHandler';

const fetchAndSaveCollection = async (
	collectionId: string,
	pathToFile: string
): Promise<string> => {
	return new Promise((resolve, reject) => {
		if (collectionId === '') {
			reject(Error('Error when fetching collection. CollectionId is empty.'));
		}
		if (pathToFile === '') {
			reject(
				new Error('Error when fetching collection. Path to file is empty.')
			);
		}

		fetchCollection(collectionId)
			.then((map) => {
				return serializeMap(map);
			})
			.then((stringifiedMap) => {
				const stringToSave = `const ${collectionId}: Iterable<readonly [string, string]> = ${stringifiedMap}
export default ${collectionId};
`;

				return saveStringToFile(stringToSave, pathToFile);
			})
			.then(() => {
				resolve(`Successfully wrote to ${pathToFile}`);
			})
			.catch((error) => {
				reject(error);
			});
	});
};

export default fetchAndSaveCollection;
