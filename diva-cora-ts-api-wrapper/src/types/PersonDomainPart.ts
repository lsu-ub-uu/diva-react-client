import { Record } from './Record';

export type Affiliation = {
	id: string;
	fromYear?: string;
	untilYear?: string;
};

export interface PersonDomainPart extends Record {
	identifiers?: string[];
	domain: string;
	affiliations: Affiliation[];
}
