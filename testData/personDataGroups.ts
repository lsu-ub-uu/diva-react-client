import { DataGroup } from '../src/converter/CoraData';

export const completePersonDataGroup: DataGroup = {
	name: 'person',
	children: [
		{
			name: 'recordInfo',
			children: [
				{
					name: 'id',
					value: 'someId',
				},
			],
		},
		{
			children: [
				{
					name: 'familyName',
					value: 'SomeFamilyName',
				},
				{
					name: 'givenName',
					value: 'SomeGivenName',
				},
			],
			name: 'authorisedName',
		},
		{
			name: 'alternativeName',
			children: [
				{
					name: 'familyName',
					value: 'SomeAlternativeFamilyName',
				},
				{
					name: 'givenName',
					value: 'SomeAlternativeGivenName',
				},
			],
			repeatId: '0',
		},
		{
			name: 'alternativeName',
			children: [
				{
					name: 'familyName',
					value: 'SomeOtherAlternativeFamilyName',
				},
				{
					name: 'givenName',
					value: 'SomeOtherAlternativeGivenName',
				},
			],
			repeatId: '1',
		},
		{
			repeatId: '0',
			name: 'ORCID_ID',
			value: '0000-0001-6885-9290',
		},
		{
			repeatId: '1',
			name: 'ORCID_ID',
			value: '0000-234-5454-65656',
		},
		{
			name: 'VIAF_ID',
			value: 'someViaf',
			repeatId: '0',
		},
		{
			name: 'VIAF_ID',
			value: 'someOtherViaf',
			repeatId: '1',
		},
		{
			name: 'Libris_ID',
			value: 'someLibris',
			repeatId: '0',
		},
		{
			name: 'Libris_ID',
			value: 'someOtherLibris',
			repeatId: '1',
		},
	],
};

export const createMinimumPersonDataGroup = (): DataGroup => {
	return {
		name: 'person',
		children: [
			{
				name: 'recordInfo',
				children: [
					{
						name: 'id',
						value: 'someId',
					},
				],
			},
			{
				children: [
					{
						name: 'familyName',
						value: 'someFamilyName',
					},
					{
						name: 'givenName',
						value: 'someGivenName',
					},
				],
				name: 'authorisedName',
			},
		],
	};
};

export default { completePersonDataGroup };
