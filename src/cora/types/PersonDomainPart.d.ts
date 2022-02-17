import { Record } from './Record';

export interface PersonDomainPart extends Record {
	identifiers?: string[];
}
