import Listable from '../../src/control/Listable';
import Name from '../../src/control/Name';
import Person from '../../src/control/Person';
import OtherID from '../../src/control/OtherID';
const name: Name = new Name('Anka', 'Kalle');
const person = new Person('someId', name);

describe('The Person class', () => {
	it('should have a constructor with id and name', () => {
		expect(person.id).toStrictEqual('someId');
		expect(person.authorisedName).toStrictEqual(name);
	});
	it('should have a setter taking an array of domains and saving them', () => {
		const domains: string[] = ['Test', 'UU'];
		person.setDomains(domains);
		expect(person.domains).toStrictEqual(domains);
	});

	it('should have a setter taking an array of other ids and saving them', () => {
		const otherIds: OtherID[] = [{ id: '0000-0001-6885-9290', type: 'ORCID' }];
		person.setOtherIds(otherIds);
		expect(person.otherIds).toStrictEqual(otherIds);
	});

	it('should implement Listable', () => {
		const listablePerson: Listable = new Person('someId', name);
		expect(listablePerson.presentation).toBeDefined();
		expect(listablePerson.getLink).toBeDefined();
	});
	it('should implement presentation() which should return name as string', () => {
		expect(person.presentation()).toStrictEqual('Anka, Kalle');
	});
	it('should implement getLink() which should return a proper link', () => {
		expect(person.getLink()).toStrictEqual('/person/someId');
	});
});
