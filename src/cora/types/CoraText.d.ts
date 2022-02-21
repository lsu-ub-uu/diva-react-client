import { Record } from './Record';

export interface CoraText extends Record {
	name: string;
	defaultText: {
		text: string;
	};
	alternativeText?: {
		text: string;
	};
}
