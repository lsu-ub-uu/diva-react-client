import fetchCollectionsWithBaseDir from './collections/fetchCollections';
import fetchLoginUnitsWithBaseDir from './loginUnits';

console.log('Running DiVA Resource Fetcher');

if (process.argv.length < 3) {
	console.error(
		'No basePath given, please supply basePath to save the resources to.'
	);
	process.exit(1);
}

const basePath = process.argv[2];
console.log(`Received basePath: '${basePath}'`);

const collectionPromise = fetchCollectionsWithBaseDir(basePath);
// .then((res) => {
// 	console.log(res);
// })
// .catch((error) => {
// 	console.error(error);
// });

const loginUnitsPromise = fetchLoginUnitsWithBaseDir(basePath);
// .then((res) => {
// 	console.log(res);
// })
// .catch((error) => {
// 	console.error(error);
// });

Promise.all([collectionPromise, loginUnitsPromise])
	.then((values) => {
		console.log(values);
		process.exit(0);
	})
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
