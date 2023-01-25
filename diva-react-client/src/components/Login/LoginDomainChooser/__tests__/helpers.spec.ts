import { LoginType } from 'diva-cora-ts-api-wrapper';
import getIdpLoginServerPartFromUrl, {
	escapeSearchString,
	filterLoginUnits,
} from '../helpers';

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

			process.env.FAKE_IDPLOGINSERVERPART =
				'someOtherFakeLoginServerPart';
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

	const loginUnits = [
		{
			url: 'someUrl1',
			displayTextEn: 'displayTextEn',
			displayTextSv: 'Uppsala Universitet',
			type: LoginType.LoginWebRedirect,
		},
		{
			url: 'someUrl2',
			displayTextEn: 'displayTextEn2',
			displayTextSv: 'Annan Universitet',
			type: LoginType.LoginWebRedirect,
		},
		{
			url: 'someUrl3',
			displayTextEn: 'displayTextEn3',
			displayTextSv: 'Uppsala Annat',
			type: LoginType.LoginWebRedirect,
		},
		{
			url: 'someUrl4',
			displayTextEn: 'displayTextEn4',
			displayTextSv: 'Uppla?nds nånting',
			type: LoginType.LoginWebRedirect,
		},
	];

	describe('filterLoginUnits', () => {
		it('takes array of LoginUnitObjects and searchString', () => {
			filterLoginUnits(loginUnits, 'someString');
		});

		it('filters loginUnits with searchString', () => {
			expect(filterLoginUnits(loginUnits, 'Upp')).toStrictEqual([
				{
					url: 'someUrl1',
					displayTextEn: 'displayTextEn',
					displayTextSv: 'Uppsala Universitet',
					type: LoginType.LoginWebRedirect,
				},
				{
					url: 'someUrl3',
					displayTextEn: 'displayTextEn3',
					displayTextSv: 'Uppsala Annat',
					type: LoginType.LoginWebRedirect,
				},
				{
					url: 'someUrl4',
					displayTextEn: 'displayTextEn4',
					displayTextSv: 'Uppla?nds nånting',
					type: LoginType.LoginWebRedirect,
				},
			]);
			expect(filterLoginUnits(loginUnits, '?')).toStrictEqual([
				{
					url: 'someUrl4',
					displayTextEn: 'displayTextEn4',
					displayTextSv: 'Uppla?nds nånting',
					type: LoginType.LoginWebRedirect,
				},
			]);
			expect(filterLoginUnits(loginUnits, 'Anna')).toStrictEqual([
				{
					url: 'someUrl2',
					displayTextEn: 'displayTextEn2',
					displayTextSv: 'Annan Universitet',
					type: LoginType.LoginWebRedirect,
				},
				{
					url: 'someUrl3',
					displayTextEn: 'displayTextEn3',
					displayTextSv: 'Uppsala Annat',
					type: LoginType.LoginWebRedirect,
				},
			]);
		});
	});
});
