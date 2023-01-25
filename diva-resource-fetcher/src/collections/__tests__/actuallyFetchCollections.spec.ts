/* eslint-disable no-console */
import fetchCollectionsWithBaseDir from '../fetchCollections';

jest.setTimeout(10000);

describe.skip('run fetchCollections', () => {
	it('runs it', async () => {
		process.env.REST_API_BASE_URL = '';

		try {
			const res = await fetchCollectionsWithBaseDir('./lists/');
			console.log(res);
			expect(res).toStrictEqual(true);
		} catch (error) {
			console.log(error);
		}
	});
});
