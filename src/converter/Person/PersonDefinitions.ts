import { Matcher } from '../Converter';
import { RecordObject } from '../GenericDefinitions';

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

export interface PersonObject extends RecordObject {
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
}

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
	{
		react: 'recordType',
		cora: 'recordInfo/type/linkedRecordId',
		required: true,
	},
	{
		react: 'orcids',
		cora: 'ORCID_ID',
		multiple: true,
	},
	{
		react: 'viafIDs',
		cora: 'VIAF_ID',
		multiple: true,
	},
	{
		react: 'librisIDs',
		cora: 'Libris_ID',
		multiple: true,
	},
];
