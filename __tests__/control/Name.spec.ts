import Name from '../../src/control/Name';

describe.only('The Name class', () => {
	it('should have a constructor with familyName and givenName', () => {
		const name = new Name('Anka', 'Kalle');
		expect(name.familyName).toStrictEqual('Anka');
		expect(name.givenName).toStrictEqual('Kalle');
	});
	it('should implement toString which should return familyName, givenName', () => {
		const name = new Name('Anka', 'Kalle');
		expect(name.toString()).toStrictEqual('Anka, Kalle');

		const onlyFamily = new Name('Anka', '');
		expect(onlyFamily.toString()).toStrictEqual('Anka');

		const onlyGiven = new Name('', 'Kalle');
		expect(onlyGiven.toString()).toStrictEqual('Kalle');

		const emptyName = new Name('', '');
		expect(emptyName.toString()).toStrictEqual('');
	});
});
