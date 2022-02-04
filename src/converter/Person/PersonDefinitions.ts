export type objectName = {
	familyName: string;
	givenName: string;
};

// const PersonMatcher = [
// 	{
// 		react: 'id',
// 		cora: 'recordinfo/id',
// 	},
// 	{
// 		react: 'authorisedName',
// 		cora: 'authorisedName(NameMatcher)',
// 	},
// 	{
// 		react: 'alternativeNames[]',
// 		cora: 'alternativeName[](NameMatcher)',
// 	},
// 	{
// 		react: 'authorisedName',
// 		cora: 'name#type:authorised(NameMatcher)',
// 	},
// 	{
// 		react: 'alternativeNames[]',
// 		cora: 'name#type:alternative[](NameMatcher)',
// 	},
// 	{
// 		react: 'orcidIDs[]',
// 		cora: 'ORCID_ID[]',
// 	},
// ];

// const NameMatcher = [
// 	{
// 		react: 'familyName',
// 		cora: 'familyName',
// 	},
// 	{
// 		react: 'givenName',
// 		cora: 'givenName',
// 	},
// 	{
// 		react: 'language',
// 		cora: '#lang',
// 	},
// ];

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
