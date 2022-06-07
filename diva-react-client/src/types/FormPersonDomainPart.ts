import { PersonDomainPart } from 'diva-cora-ts-api-wrapper';

export type FormAffiliationLink = {
	id: string;
	fromYear: string;
	untilYear: string;
};

export interface FormPersonDomainPart {
	id: string;
	identifiers: string[];
	domain: string;
	affiliations: FormAffiliationLink[];
}

export const convertToFormPersonDomainPart = (
	personDomainPart: PersonDomainPart
): FormPersonDomainPart => {
	let affiliations: FormAffiliationLink[] = [];

	if (personDomainPart.affiliations) {
		affiliations = personDomainPart.affiliations.map((affiliation) => {
			return {
				fromYear: '',
				untilYear: '',
				...affiliation,
			};
		});
	}

	return {
		id: personDomainPart.id,
		domain: personDomainPart.domain,
		affiliations,
		identifiers: personDomainPart.identifiers || [],
	};
};
