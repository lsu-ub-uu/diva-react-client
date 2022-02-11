import { Matcher } from '../Converter';

type NameObject = {
	familyName: string;
	givenName: string;
};

type ExternalUrlObject = {
	linkTitle: string;
	URL: string;
};

type BiographyObject = {
	biography: string;
	language: string;
};

export type PersonObject = {
	id: string;

	domains?: string[];

	authorisedName: NameObject;

	academicTitle?: string;

	yearOfBirth?: string;

	yearOfDeath?: string;

	emailAddress?: string;

	alternativeNames?: NameObject[];

	externalURLs?: ExternalUrlObject[];

	otherAffiliation?: {
		affiliation: string;
		affiliationFromYear: string;
		affiliationUntilYear: string;
	}[];

	orcids?: string[];

	viafIDs?: string[];

	librisIDs?: string[];

	biographyEnglish?: BiographyObject;

	biographySwedish?: BiographyObject;

	personDomainPart?: string[];
};

const NameMatcher: Matcher = [
	{
		cora: 'familyName',
		react: 'familyName',
	},
	{
		cora: 'givenName',
		react: 'givenName',
	},
];

export const personMatcher: Matcher = [
	{
		react: 'id',
		cora: 'recordInfo/id',
		required: true,
	},
	{
		react: 'domains',
		cora: 'recordInfo/domain',
		multiple: true,
	},
	{
		react: 'authorisedName',
		cora: 'authorisedName',
		nextMatcher: NameMatcher,
	},
	{
		react: 'academicTitle',
		cora: 'academicTitle',
	},
];
