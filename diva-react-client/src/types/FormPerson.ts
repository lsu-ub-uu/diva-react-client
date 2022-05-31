import {
	Affiliation,
	ExternalUrl,
	Name,
	Person,
} from 'diva-cora-ts-api-wrapper';
import { Repeatable } from './Repeatable';

export interface FormPerson {
	id: string;

	domains: string[];

	authorisedName: Name;

	academicTitle: string;

	yearOfBirth: string;

	yearOfDeath: string;

	emailAddress: string;

	alternativeNames: Repeatable<Name>[];

	externalURLs: Repeatable<ExternalUrl>[];

	otherAffiliation: Affiliation;

	orcids: string[];

	viafIDs: string[];

	librisIDs: string[];

	biographyEnglish: string;

	biographySwedish: string;

	personDomainParts: string[];

	public: string;
}

const returnStringIfUndefined = (field: string | undefined) => {
	return field || '';
};

const returnEmptyArrayIfUndefined = function <T>(field: T[] | undefined) {
	return field || [];
};

export const convertToFormPerson = (person: Person): FormPerson => {
	const personDomainParts: string[] = [];
	if (person.personDomainParts) {
		person.personDomainParts.forEach((pdp) => {
			personDomainParts.push(pdp.recordId);
		});
	}

	const alternativeNames = createRepeatableArray<Name>(person.alternativeNames);
	const externalURLs = createRepeatableArray<ExternalUrl>(person.externalURLs);

	return {
		id: person.id,
		domains: returnEmptyArrayIfUndefined<string>(person.domains),
		academicTitle: returnStringIfUndefined(person.academicTitle),
		alternativeNames,
		authorisedName: person.authorisedName
			? person.authorisedName
			: { familyName: '', givenName: '' },
		biographyEnglish: returnStringIfUndefined(person.biographyEnglish),
		biographySwedish: returnStringIfUndefined(person.biographySwedish),
		emailAddress: returnStringIfUndefined(person.emailAddress),
		externalURLs,
		librisIDs: returnEmptyArrayIfUndefined<string>(person.librisIDs),
		orcids: returnEmptyArrayIfUndefined<string>(person.orcids),
		viafIDs: returnEmptyArrayIfUndefined<string>(person.viafIDs),
		otherAffiliation: person.otherAffiliation
			? person.otherAffiliation
			: { name: '', fromYear: '', untilYear: '' },
		personDomainParts,
		yearOfBirth: returnStringIfUndefined(person.yearOfBirth),
		yearOfDeath: returnStringIfUndefined(person.yearOfDeath),
		public: person.public,
	};
};
function createRepeatableArray<T>(array?: T[]): Repeatable<T>[] {
	const repeatableArray: Repeatable<T>[] = [];
	if (array) {
		array.forEach((content, repeatId) => {
			repeatableArray.push({
				repeatId,
				content,
			});
		});
	}
	return repeatableArray;
}
