import Name from '../src/control/Name';
import Person from '../src/control/Person';

export const personWithDomain: Person = new Person(
	'2',
	new Name('Enequist', 'Gerd')
);
personWithDomain.setDomains(['Uppsala Universitet', 'Test']);

export const threePersonObjects: Person[] = [
	new Person('1', new Name('Anka', 'Kalle')),
	personWithDomain,
	new Person('3', new Name('Ernman', 'Malena')),
];
