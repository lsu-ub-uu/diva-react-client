import Name from '../../src/control/Name';

let name: Name;
describe.only('The Name class', () => {
	it('should have a constructor with familyName and givenName', () => {
		createName();
		expect(name.familyName).toStrictEqual('Anka');
		expect(name.givenName).toStrictEqual('Kalle');
	});
	it('should implement toString which should return familyName, givenName', () => {
		expect(name.toString()).toStrictEqual('Anka, Kalle');
	});
});

function createName() {
	name = new Name('Anka', 'Kalle');
}
