import ExternalUrl from '../../control/ExternalUrl';
import Name from '../../control/Name';
import Person from '../../control/Person';
import { PersonObject } from './PersonDefinitionsOld';

export const createPersonFromPersonObject = (
	personObject: PersonObject
): Person => {
	const authorisedName = new Name(
		personObject.person.authorisedName.familyName,
		personObject.person.authorisedName.givenName
	);

	const person = new Person(personObject.person.recordInfo.id, authorisedName);

	if (personObject.person.recordInfo.domain !== undefined) {
		person.domains = personObject.person.recordInfo.domain;
	}

	person.academicTitle = getValueOrEmptyString(
		personObject.person.academicTitle
	);

	person.yearOfBirth = getValueOrEmptyString(personObject.person.yearOfBirth);
	person.yearOfDeath = getValueOrEmptyString(personObject.person.yearOfDeath);
	person.emailAddress = getValueOrEmptyString(personObject.person.emailAddress);

	let alternativeNames: Name[] = [];
	if (personObject.person.alternativeName !== undefined) {
		alternativeNames = personObject.person.alternativeName.map((element) => {
			return new Name(element.familyName, element.givenName);
		});
		person.alternativeNames = alternativeNames;
	}

	if (personObject.person.externalURL !== undefined) {
		let externalURLs: ExternalUrl[] = [];
		externalURLs = personObject.person.externalURL.map((element) => {
			return {
				linkTitle: element.linkTitle,
				URL: element.URL,
			};
		});
		person.externalURLs = externalURLs;
	}

	if (personObject.person.otherAffiliation !== undefined) {
		const otherAffiliations = personObject.person.otherAffiliation.map(
			(element) => {
				return {
					affiliation: element.affiliation,
					affiliationFromYear: element.affiliationFromYear,
					affiliationUntilYear: element.affiliationUntilYear,
				};
			}
		);
		person.otherAffiliation = otherAffiliations;
	}

	if (personObject.person.ORCID_ID !== undefined) {
		person.orcidIDs = personObject.person.ORCID_ID;
	}
	if (personObject.person.VIAF_ID !== undefined) {
		person.viafIDs = personObject.person.VIAF_ID;
	}
	if (personObject.person.Libris_ID !== undefined) {
		person.librisIDs = personObject.person.Libris_ID;
	}

	if (personObject.person.biographyEnglish !== undefined) {
		person.biographyEnglish = personObject.person.biographyEnglish;
	}

	if (personObject.person.biographySwedish !== undefined) {
		person.biographySwedish = personObject.person.biographySwedish;
	}

	if (personObject.person.personDomainPart !== undefined) {
		person.personDomainPart = personObject.person.personDomainPart;
	}

	return person;
};

function getValueOrEmptyString(str: string | undefined) {
	return str !== undefined ? str : '';
}

export default createPersonFromPersonObject;
