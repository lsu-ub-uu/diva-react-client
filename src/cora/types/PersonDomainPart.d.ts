import { Record } from './Record';

export interface PersonDomainPart extends Record {
	identifiers?: string[];
	affiliations?: {
		name: string;
		fromYear: string;
		untilYear: string;
	}[];
}
