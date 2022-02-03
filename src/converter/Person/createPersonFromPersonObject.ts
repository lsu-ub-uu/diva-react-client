import ExternalUrl from '../../control/ExternalUrl';
import Name from '../../control/Name';
import Person from '../../control/Person';
import { PersonObject } from './PersonDefinitions';

export const createPersonFromPersonObject = (
	personObject: PersonObject
): Person => {
	const authorisedName = new Name(
		personObject.person.authorisedName.familyName,
		personObject.person.authorisedName.givenName
	);

	const person = new Person(personObject.person.recordInfo.id, authorisedName);

	let alternativeNames: Name[] = [];

	if (personObject.person.alternativeName !== undefined) {
		alternativeNames = personObject.person.alternativeName.map((element) => {
			return new Name(element.familyName, element.givenName);
		});
	}

	person.alternativeNames = alternativeNames;
	person.title = getValueOrEmptyString(personObject.person.academicTitle);
	person.orcidIDs = getArrayOrEmptyArray(personObject.person.ORCID_ID);
	person.viafIDs = getArrayOrEmptyArray(personObject.person.VIAF_ID);
	person.librisIDs = getArrayOrEmptyArray(personObject.person.Libris_ID);

	let externalURLs: ExternalUrl[] = [];
	if (personObject.person.externalURL !== undefined) {
		externalURLs = personObject.person.externalURL.map((element) => {
			return {
				linkTitle: element.linkTitle,
				URL: element.URL,
			};
		});
		person.externalURLs = externalURLs;
	}

	return person;
};

function getArrayOrEmptyArray(arr: string[] | undefined) {
	return arr === undefined ? [] : arr;
}

function getValueOrEmptyString(str: string | undefined) {
	return str !== undefined ? str : '';
}

export default createPersonFromPersonObject;
