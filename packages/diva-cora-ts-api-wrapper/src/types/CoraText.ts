import { Record } from './Record';

export interface CoraText extends Record {
	defaultText: {
		text: string;
	};
	alternativeText?: {
		text: string;
	};
}
