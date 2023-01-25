import fetchAndSaveLoginUnits from './fetchAndSaveLoginUnits';

const fetchLoginUnitsWithBaseDir = async (baseDir: string) => {
	return new Promise((resolve, reject) => {
		if (baseDir === '') {
			reject(
				new Error(
					'Error in fetchCollectionsWithBaseDir. No baseDir given."'
				)
			);
		}

		fetchAndSaveLoginUnits(`${baseDir}loginUnits.ts`)
			.then((message) => {
				resolve(message);
			})
			.catch((error) => {
				reject(error);
			});
	});
};

export default fetchLoginUnitsWithBaseDir;
