import { Record } from './Record';

export interface PersonDomainPart extends Record {
	identifiers?: string[];
	domain: string;
	affiliations?: {
		id: string;
		fromYear?: string;
		untilYear?: string;
	}[];
}
