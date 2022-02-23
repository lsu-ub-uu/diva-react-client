import getDomainCollection from './collections';

describe('collections', () => {
	describe('getDomainCollection', () => {
		it('exists', () => {
			getDomainCollection();
		});

		it('returns map', () => {
			const map = getDomainCollection();

			expect(map.get('kth')).toStrictEqual('Kungliga Tekniska Högskolan');
		});
	});
});
