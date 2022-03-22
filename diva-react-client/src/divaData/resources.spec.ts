import { LoginType } from 'diva-cora-ts-api-wrapper';
import getDomainCollection, { getLoginUnits } from './resources';

// jest.mock('../../lists/loginUnits');

jest.mock('../../lists/loginUnits', () => ({
	loginUnits: [
		{
			url: 'someUrl',
			displayTextEn: 'someDisplayTextEn',
			displayTextSv: 'someDisplayTextSv',
			type: LoginType.LoginWebRedirect,
		},
		{
			url: 'someUrl2',
			displayTextEn: 'someDisplayTextEn2',
			displayTextSv: 'someDisplayTextSv2',
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
					displayTextEn: 'someDisplayTextEn',
					displayTextSv: 'someDisplayTextSv',
					type: LoginType.LoginWebRedirect,
				},
				{
					url: 'someUrl2',
					displayTextEn: 'someDisplayTextEn2',
					displayTextSv: 'someDisplayTextSv2',
					type: LoginType.LoginWebRedirect,
				},
			]);
		});
	});
});
