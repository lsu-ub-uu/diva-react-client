import { Record } from './Record';

export interface LoginUnit extends Record {
	loginInfo: {
		loginType: string;
		loginName: string;
		loginDescriptionName: string;
	};
}
