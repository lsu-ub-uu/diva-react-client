import getIdpLoginServerPartFromUrl, { escapeSearchString } from './helpers';

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

		it('returns FakeLoginServerPart if it is set', () => {
			process.env.FAKE_IDPLOGINSERVERPART = 'someFakeLoginServerPart';
			expect(
				getIdpLoginServerPartFromUrl(
					'https://somethingsomething?target=https://www.something.foo/asdf/idplogin/login'
				)
			).toStrictEqual('someFakeLoginServerPart');

			process.env.FAKE_IDPLOGINSERVERPART = 'someOtherFakeLoginServerPart';
			expect(
				getIdpLoginServerPartFromUrl(
					'https://somethingsomething?target=https://foobar/asdf/idplogin/login'
				)
			).toStrictEqual('someOtherFakeLoginServerPart');
		});
	});

	describe('escapeSearchString', () => {
		it('takes a string', () => {
			escapeSearchString('someString');
		});

		it('returns a string with escaped special characters: [ \\ ^ $ . | ? * + ( )', () => {
			expect(escapeSearchString('[')).toStrictEqual('\\[');
			expect(escapeSearchString('\\')).toStrictEqual('\\\\');
			expect(escapeSearchString('^')).toStrictEqual('\\^');
			expect(escapeSearchString('$')).toStrictEqual('\\$');
			expect(escapeSearchString('.')).toStrictEqual('\\.');
			expect(escapeSearchString('|')).toStrictEqual('\\|');
			expect(escapeSearchString('?')).toStrictEqual('\\?');
			expect(escapeSearchString('*')).toStrictEqual('\\*');
			expect(escapeSearchString('+')).toStrictEqual('\\+');
			expect(escapeSearchString('(')).toStrictEqual('\\(');
			expect(escapeSearchString(')')).toStrictEqual('\\)');
			expect(escapeSearchString('[ \\ ^ $ . | ? * + ( )')).toStrictEqual(
				'\\[ \\\\ \\^ \\$ \\. \\| \\? \\* \\+ \\( \\)'
			);
		});
	});
});
