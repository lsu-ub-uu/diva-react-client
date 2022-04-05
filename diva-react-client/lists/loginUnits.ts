import { LoginType, LoginUnitObject } from 'diva-cora-ts-api-wrapper';

export const loginUnits: LoginUnitObject[] = [
	{
		url: 'http://example.com',
		displayTextSv: 'Exempelinloggning',
		displayTextEn: 'Login example',
		type: LoginType.LoginWebRedirect,
	},
	{
		url: '',
		displayTextSv: 'LDAP Inloggning',
		displayTextEn: 'LDAP Login',
		type: LoginType.LoginLDAP,
	},
];

export default { loginUnits };
