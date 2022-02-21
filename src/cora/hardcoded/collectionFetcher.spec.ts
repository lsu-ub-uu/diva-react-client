import fetchCollection, { fetchCollectionItem } from './collectionFetcher';

beforeAll(() => {
	process.env.BASE_URL = 'https://cora.test.diva-portal.org/diva/rest/';
	jest.setTimeout(10000);
});

describe('fetchCollection', () => {
	it('fetches a collection', async () => {
		expect.assertions(1);
		const foo = await fetchCollection('domainCollection');

		console.log(foo);
	});

	it.skip('collectinItem', async () => {
		expect.assertions(1);
		const foo = await fetchCollectionItem('fhsItem');

		console.log(foo);
	});
});
