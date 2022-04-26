import { Organisation } from './Organisation';
import { Record } from './Record';

export type Affiliation = {
	id: string;
	fromYear?: string;
	untilYear?: string;
	organisation?: Organisation;
};

export interface PersonDomainPart extends Record {
	identifiers?: string[];
	domain: string;
	affiliations: Affiliation[];
}
