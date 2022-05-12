import { PersonDomainPart } from 'diva-cora-ts-api-wrapper';

export type FormAffiliation = {
	id: string;
	fromYear: string;
	untilYear: string;
};

export interface FormPersonDomainPart {
	id: string;
	identifiers: string[];
	domain: string;
	affiliations: FormAffiliation[];
}

export const convertToFormPersonDomainPart = (
	personDomainPart: PersonDomainPart
): FormPersonDomainPart => {
	let affiliations: FormAffiliation[] = [];

	if (personDomainPart.affiliations) {
		affiliations = personDomainPart.affiliations.map((affiliation) => {
			return {
				fromYear: '',
				untilYear: '',
				...affiliation,
				organisation: undefined,
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
