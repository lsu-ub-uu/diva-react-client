import { List } from 'diva-cora-ts-api-wrapper';

const listWithThreeLoginUnits: List = {
	fromNumber: 1,
	toNumber: 3,
	totalNumber: 3,
	data: [
		{
			loginInfo: {
				loginType: 'webRedirectLogin',
				loginName: 'someLoginName1',
				loginDescriptionName: 'someLoginDescription1',
			},
		},
		{
			loginInfo: {
				loginType: 'webRedirectLogin',
				loginName: 'someLoginName2',
				loginDescriptionName: 'someLoginDescription2',
			},
		},
		{
			loginInfo: {
				loginType: 'webRedirectLogin',
				loginName: 'someLoginName3',
				loginDescriptionName: 'someLoginDescription3',
			},
		},
	],
};

export default listWithThreeLoginUnits;
