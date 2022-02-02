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

export const createCompletePerson = () => {
	const completePerson: Person = new Person(
		'somePID',
		new Name('Celsius', 'Anders')
	);

	completePerson.orcidIDs = ['someOrcid', 'someOtherOrcid'];
	completePerson.viafIDs = ['someViaf', 'someOtherViaf'];
	completePerson.librisIDs = ['someLibris', 'someOtherLibris'];

	completePerson.domains = ['someDomain', 'someOtherDomain'];

	return completePerson;
};

export const createMinimumPersonWithIdAndName = (
	id: string = 'someId',
	lastName: string = 'LastName',
	firstName: string = 'FirstName'
) => {
	return new Person(id, new Name(lastName, firstName));
};

export const completePerson: Person = createCompletePerson();
