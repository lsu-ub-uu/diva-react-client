import { RecordType } from '.';
import { Record } from './Record';

export interface LoginUnit extends Record {
	loginInfo: {
		loginType: string;
		loginName: string;
		loginDescriptionName: string;
	};
}

export type LoginUnitObject = {
	type: LoginType;
	url: string;
	displayTextSv: string;
	displayTextEn: string;
};

export enum LoginType {
	LoginWebRedirect = RecordType.LoginWebRedirect,
}
