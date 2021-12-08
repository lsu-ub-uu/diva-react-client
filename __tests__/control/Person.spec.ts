import Listable from '../../src/control/Listable';
import Name from '../../src/control/Name';
import Person from '../../src/control/Person';

const name: Name = new Name('Anka', 'Kalle');
const person = new Person('someId', name);

describe('The Person class', () => {
	it('should have a constructor with id and name', () => {
		expect(person.id).toStrictEqual('someId');
		expect(person.authorisedName).toStrictEqual(name);
	});
	it('should implement Listable', () => {
		const listablePerson: Listable = new Person('someId', name);
		expect(listablePerson.presentation).toBeDefined();
	});
	it('should implement presentation() which should return name as string', () => {
		expect(person.presentation()).toStrictEqual('Anka, Kalle');
	});
	it('should have a setter taking an array of domains and saving them', () => {
		const domains: string[] = ['Test', 'UU'];
		person.setDomains(domains);
		expect(person.domains).toStrictEqual(domains);
	});
});
