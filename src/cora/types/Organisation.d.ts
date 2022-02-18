import { Record } from './Record';

export interface Organisation extends Record {
	name: string;
	alternativeName: string;
}
