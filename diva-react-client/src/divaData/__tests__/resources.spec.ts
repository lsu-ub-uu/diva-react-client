import { LoginType } from 'diva-cora-ts-api-wrapper';
import getDomainCollection, {
	getLoginUnits,
	getSortedLoginUnits,
} from '../resources';

jest.mock('../../../lists/loginUnits', () => ({
	loginUnits: [
		{
			url: 'someUrl',
			displayTextEn: 'Bb an english text',
			displayTextSv: 'Bb en svensk text',
			type: LoginType.LoginWebRedirect,
		},
		{
			url: 'someUrl',
			displayTextEn: 'Aa an english text',
			displayTextSv: 'Cc en svensk text',
			type: LoginType.LoginWebRedirect,
		},
		{
			url: 'someUrl2',
			displayTextEn: 'Zz an english text',
			displayTextSv: 'Aa en svensk text',
			type: LoginType.LoginWebRedirect,
		},
	],
}));

describe('collections', () => {
	describe('getDomainCollection', () => {
		it('exists', () => {
			getDomainCollection();
		});

		it('returns map', () => {
			const map = getDomainCollection();

			map.set('kth', 'Kungliga Tekniska Högskolan');

			expect(map.get('kth')).toStrictEqual('Kungliga Tekniska Högskolan');
		});
	});

	describe('getLoginUnits', () => {
		it('exists', () => {
			getLoginUnits();
		});

		it('returns array containing LoginUnitObjects', () => {
			const loginUnitArray = getLoginUnits();

			expect(loginUnitArray).toStrictEqual([
				{
					url: 'someUrl',
					displayTextEn: 'Bb an english text',
					displayTextSv: 'Bb en svensk text',
					type: LoginType.LoginWebRedirect,
				},
				{
					url: 'someUrl',
					displayTextEn: 'Aa an english text',
					displayTextSv: 'Cc en svensk text',
					type: LoginType.LoginWebRedirect,
				},
				{
					url: 'someUrl2',
					displayTextEn: 'Zz an english text',
					displayTextSv: 'Aa en svensk text',
					type: LoginType.LoginWebRedirect,
				},
			]);
		});
	});

	describe('getSortedLoginUnits', () => {
		const sortedLoginunits = getSortedLoginUnits();

		expect(sortedLoginunits).toStrictEqual([
			{
				url: 'someUrl2',
				displayTextEn: 'Zz an english text',
				displayTextSv: 'Aa en svensk text',
				type: LoginType.LoginWebRedirect,
			},
			{
				url: 'someUrl',
				displayTextEn: 'Bb an english text',
				displayTextSv: 'Bb en svensk text',
				type: LoginType.LoginWebRedirect,
			},
			{
				url: 'someUrl',
				displayTextEn: 'Aa an english text',
				displayTextSv: 'Cc en svensk text',
				type: LoginType.LoginWebRedirect,
			},
		]);
	});
});
