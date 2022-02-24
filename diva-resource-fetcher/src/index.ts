import fetchCollectionsWithBaseDir from './fetchCollections';

console.log('Running DiVA Resource Fetcher');

if (process.argv.length < 3) {
	console.error(
		'No basePath given, please supply basePath to save the resources to.'
	);
	process.exit(1);
}

const basePath = process.argv[2];
console.log(`Received basePath: '${basePath}'`);

fetchCollectionsWithBaseDir(basePath)
	.then((res) => {
		console.log(res);
		process.exit(0);
	})
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
