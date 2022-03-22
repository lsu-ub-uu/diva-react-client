import { LoginType, LoginUnitObject } from 'diva-cora-ts-api-wrapper';

const loginUnits: LoginUnitObject[] = [
	{
		url: 'http://example.com',
		displayTextSv: 'Exempelinloggning',
		displayTextEn: 'Login example',
		type: LoginType.LoginWebRedirect,
	},
];

export default loginUnits;
