import { getDisplayName } from './NameTools';

describe('NameTools', () => {
	describe('getDisplayName', () => {
		it('takes a name', () => {
			getDisplayName({
				familyName: 'someFamilyName',
				givenName: 'someGivenName',
			});
		});

		it('returns a string containing familyName, givenName', () => {
			expect(
				getDisplayName({
					familyName: 'someFamilyName',
					givenName: 'someGivenName',
				})
			).toStrictEqual('someFamilyName, someGivenName');

			expect(
				getDisplayName({
					familyName: 'someOtherFamilyName',
					givenName: 'someOtherGivenName',
				})
			).toStrictEqual('someOtherFamilyName, someOtherGivenName');
		});

		it('if empty familyName, displays givenName', () => {
			expect(
				getDisplayName({
					familyName: '',
					givenName: 'someGivenName',
				})
			).toStrictEqual('someGivenName');

			expect(
				getDisplayName({
					familyName: '',
					givenName: 'someOtherGivenName',
				})
			).toStrictEqual('someOtherGivenName');
		});

		it('if empty givenName, displays familyName', () => {
			expect(
				getDisplayName({
					familyName: 'someFamilyName',
					givenName: '',
				})
			).toStrictEqual('someFamilyName');

			expect(
				getDisplayName({
					familyName: 'someOtherFamilyName',
					givenName: '',
				})
			).toStrictEqual('someOtherFamilyName');
		});
	});
});
