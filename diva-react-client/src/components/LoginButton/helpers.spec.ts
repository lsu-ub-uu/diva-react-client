import getIdpLoginServerPartFromUrl from './helpers';

describe('helpers', () => {
	describe('getIdpLoginServerPartFromUrl', () => {
		it('exists', () => {
			getIdpLoginServerPartFromUrl('someUrl');
		});

		it('returns IdpLoginServerPart', () => {
			expect(
				getIdpLoginServerPartFromUrl(
					'https://somethingsomething?target=https://www.something.foo/asdf/idplogin/login'
				)
			).toStrictEqual('https://www.something.foo');

			expect(
				getIdpLoginServerPartFromUrl(
					'https://somethingsomething?target=https://foobar/asdf/idplogin/login'
				)
			).toStrictEqual('https://foobar');
		});
	});
});
