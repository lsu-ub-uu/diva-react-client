import fetchAndSaveCollection from './divaCollectionFetcher';

const fetchCollectionsWithBaseDir = async (baseDir: string) => {
	return new Promise((resolve, reject) => {
		if (baseDir === '') {
			reject(
				new Error('Error in fetchCollectionsWithBaseDir. No baseDir given."')
			);
		}

		const path = `${baseDir}domainCollection.ts`;

		fetchAndSaveCollection('domainCollection', path)
			.then((res) => {
				resolve(res);
			})
			.catch((error) => {
				reject(error);
			});
	});
};

export default fetchCollectionsWithBaseDir;
