export type LoginUnitObject = {
	type: LoginType;
	url: string;
	displayTextSv: string;
	displayTextEn: string;
};

export enum LoginType {
	LoginWebRedirect = 'loginWebRedirect',
}
