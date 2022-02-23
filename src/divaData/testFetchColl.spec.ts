import fetchCollection from './collectionFetcher';
import { serializeMap } from './mapHandler';

beforeAll(() => {
	jest.setTimeout(10000);
});

describe('test', () => {
	it.skip('fetch data', async () => {
		jest.setTimeout(10000);
		process.env.BASE_URL = '';
		const domainCollection = await fetchCollection('domainCollection');

		const str = serializeMap(domainCollection);

		console.log(str);
	});
});
