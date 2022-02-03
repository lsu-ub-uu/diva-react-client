import { PersonObject } from '../converter/Person/PersonDefinitions';
import ExternalUrl from './ExternalUrl';
import Listable from './Listable';
import Name from './Name';

class Person implements Listable {
	id: string;

	authorisedName: Name;

	alternativeNames: Name[];

	title: string;

	domains?: string[];

	orcidIDs: string[];

	viafIDs: string[];

	librisIDs: string[];

	externalURLs: ExternalUrl[];

	constructor(id: string, authorisedName: Name) {
		this.id = id;
		this.authorisedName = authorisedName;
		this.alternativeNames = [];
		this.title = '';
		this.orcidIDs = [];
		this.viafIDs = [];
		this.librisIDs = [];
		this.externalURLs = [];
	}

	setDomains = (domains: string[]) => {
		this.domains = domains;
	};

	presentation = () => {
		return this.authorisedName.toString();
	};

	getLink = () => {
		return `/person/${this.id}`;
	};
}

export function fromPersonObject(personObject: PersonObject): Person {
	return new Person('asdf', new Name('asdf', 'asdf'));
}

// export function fromPersonObject(personObject: PersonObject) {
// 	const authorisedName = new Name(
// 		personObject.person.authorisedName.familyName,
// 		personObject.person.authorisedName.givenName
// 	);

// 	const person = new Person(personObject.person.recordInfo.id, authorisedName);

// 	let alternativeNames: Name[] = [];
// 	if (personObject.person.alternativeName !== undefined) {
// 		alternativeNames = personObject.person.alternativeName.map((element) => {
// 			return new Name(element.familyName, element.givenName);
// 		});
// 	}

// 	person.alternativeNames = alternativeNames;
// 	person.title =
// 		personObject.person.academicTitle !== undefined
// 			? personObject.person.academicTitle
// 			: '';
// 	person.orcidIDs = getArrayOrEmptyArray(personObject.person.ORCID_ID);
// 	person.viafIDs = getArrayOrEmptyArray(personObject.person.VIAF_ID);
// 	person.librisIDs = getArrayOrEmptyArray(personObject.person.Libris_ID);

// 	let externalURLs: ExternalUrl[] = [];
// 	if (personObject.person.externalURL !== undefined) {
// 		externalURLs = personObject.person.externalURL.map((element) => {
// 			return {
// 				linkTitle: element.linkTitle,
// 				URL: element.URL,
// 			};
// 		});
// 		person.externalURLs = externalURLs;
// 	}

// 	return person;
// }

function getArrayOrEmptyArray(arr: string[] | undefined) {
	return arr === undefined ? [] : arr;
}

export default Person;
