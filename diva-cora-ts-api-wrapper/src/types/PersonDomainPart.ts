import { Affiliation } from './Person';
import { Record } from './Record';

export interface PersonDomainPart extends Record {
	identifiers?: string[];
	domain: string;
	affiliations?: Affiliation[];
}
