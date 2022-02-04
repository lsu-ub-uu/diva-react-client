export type objectName = {
	familyName: string;
	givenName: string;
};

export type PersonObject = {
	person: {
		recordInfo: {
			id: string;
			// type: {
			// 	recordType: string;
			// };
			// createdBy: {
			// 	user: string;
			// };
			// dataDivider: {
			// 	system: string;
			// };
			// tsCreated: string;
			// updated: {
			// 	updatedBy: {
			// 		user: string;
			// 	};
			// 	tsUpdated: string;
			// }[];
			// public: string;
			domain?: string[];
		};
		authorisedName: objectName;
		academicTitle?: string;
		yearOfBirth?: string;
		yearOfDeath?: string;
		emailAddress?: string;
		alternativeName?: objectName[];
		externalURL?: {
			linkTitle: string;
			URL: string;
		}[];
		otherAffiliation?: {
			affiliation: string;
			affiliationFromYear: string;
			affiliationUntilYear: string;
		}[];
		ORCID_ID?: string[];
		VIAF_ID?: string[];
		Libris_ID?: string[];
		biographyEnglish?: {
			biography: string;
			language: string;
		};
		biographySwedish?: {
			biography: string;
			language: string;
		};
		personDomainPart?: {
			personDomainPart: string;
		}[];
	};
};

export const personMultipleDefinition = [
	'updated',
	'domain',
	'alternativeName',
	'externalURL',
	'otherAffiliation',
	'ORCID_ID',
	'VIAF_ID',
	'Libris_ID',
	'personDomainPart',
];
