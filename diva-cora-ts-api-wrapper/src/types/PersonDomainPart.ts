import { Record } from './Record';

export type AffiliationLink = {
	id: string;
	fromYear?: string;
	untilYear?: string;
};

export interface PersonDomainPart extends Record {
	identifiers?: string[];
	domain: string;
	affiliations?: AffiliationLink[];
}
