import Name from '../../control/Name';
import Person from '../../control/Person';

export type objectName = {
	familyName: string;
	givenName: string;
};

export type PersonObject = {
	person: {
		recordInfo: {
			id: string;
		};
		authorisedName: objectName;
		alternativeName?: objectName[];
		academicTitle?: string;
		ORCID_ID?: string[];
		VIAF_ID?: string[];
		Libris_ID?: string[];
		externalURL?: {
			linkTitle: string;
			URL: string;
		}[];
		otherAffiliation?: {
			affiliation: string;
			affiliationFromYear: string;
			affiliationUntilYear: string;
		}[];
	};
};

export const personMultipleDefinition = [
	'ORCID_ID',
	'alternativeName',
	'VIAF_ID',
	'Libris_ID',
	'externalURL',
	'otherAffiliation',
];

export const createPersonFromPersonObject = (
	personObject: PersonObject
): Person => {
	return new Person('asdf', new Name('asdf', 'asdf'));
};
