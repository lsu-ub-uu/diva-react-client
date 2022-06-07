import { PersonDomainPart } from 'diva-cora-ts-api-wrapper';
import { FormPersonDomainPart } from '../src/types/FormPersonDomainPart';

export const minimalPersonDomainPart: PersonDomainPart = {
	domain: 'uu',
	affiliations: [],
	id: 'someMinimalId',
	recordType: 'personDomainPart',
};

export const minimalFormPersonDomainPart: FormPersonDomainPart = {
	id: 'someMinimalId',
	identifiers: [],
	domain: 'uu',
	affiliations: [],
};

export const completePersonDomainPart: PersonDomainPart = {
	domain: 'kth',
	affiliations: [
		{
			id: 'someAffiliationid',
			fromYear: '1990',
			untilYear: '2000',
		},
	],
	identifiers: ['someIdentifier'],
	id: 'someCompleteId',
	recordType: 'personDomainPart',
};

export const completeFormPersonDomainpart: FormPersonDomainPart = {
	id: 'someCompleteId',
	identifiers: ['someIdentifier'],
	domain: 'kth',
	affiliations: [
		{
			id: 'someAffiliationid',
			fromYear: '1990',
			untilYear: '2000',
		},
	],
};
