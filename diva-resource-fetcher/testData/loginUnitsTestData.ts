import { List, LoginUnit } from 'diva-cora-ts-api-wrapper';

const loginUnits: LoginUnit[] = [
	{
		id: '1',
		recordType: 'loginUnit',
		loginInfo: {
			loginType: 'loginWebRedirect',
			loginName: 'someLoginName1',
			loginDescriptionName: 'someLoginDescription1',
		},
	},
	{
		id: '1',
		recordType: 'loginUnit',
		loginInfo: {
			loginType: 'someOtherLoginType',
			loginName: 'someLoginName2',
			loginDescriptionName: 'someLoginDescription2',
		},
	},
	{
		id: '1',
		recordType: 'loginUnit',
		loginInfo: {
			loginType: 'loginWebRedirect',
			loginName: 'someLoginName3',
			loginDescriptionName: 'someLoginDescription3',
		},
	},
];

const listWithThreeLoginUnits: List = {
	fromNumber: 1,
	toNumber: 3,
	totalNumber: 3,
	data: loginUnits,
};

export default listWithThreeLoginUnits;
