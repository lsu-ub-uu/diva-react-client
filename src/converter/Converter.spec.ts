import convertToObject, { Matcher } from './Converter';
import { DataGroup } from './CoraData';
import extractDataAtomicValue from './DataAtomicConverter';

jest.mock('./DataAtomicConverter');

describe('The Converter', () => {
	describe('convertToObject', () => {
		type DefaultTestObject = {
			someAtomicName?: string;
		};

		const defaultTestDataGroup: DataGroup = {
			name: 'someName',
			children: [
				{
					name: 'someAtomicName',
					value: 'someAtomicValue',
				},
			],
		};

		const defaultTestObjectMatcher: Matcher[] = [
			{
				react: 'someAtomicName',
				cora: 'someAtomicName',
			},
		];

		it('takes a DataGroup and a top-level-matcher', () => {
			convertToObject<DefaultTestObject>(
				defaultTestDataGroup,
				defaultTestObjectMatcher
			);
		});

		describe('Handles DataAtomics', () => {
			it('calls extractAndSetDataAtomic for one DataAtomic in matcher', () => {
				convertToObject<DefaultTestObject>(
					defaultTestDataGroup,
					defaultTestObjectMatcher
				);

				expect(extractDataAtomicValue).toHaveBeenCalledTimes(1);
				expect(extractDataAtomicValue).toHaveBeenLastCalledWith(
					defaultTestDataGroup,
					defaultTestObjectMatcher[0],
					{}
				);
			});

			it('calls extractAndSetDataAtomic for several DataAtomic in matcher', () => {
				const testDataGroup: DataGroup = {
					name: 'someName',
					children: [
						{
							name: 'someAtomicName',
							value: 'someAtomicValue',
						},
						{
							name: 'someOtherAtomicName',
							value: 'someOtherAtomicValue',
						},
					],
				};

				const testObjectMatcher: Matcher[] = [
					{
						react: 'someAtomicName',
						cora: 'someAtomicName',
						required: true,
					},
					{
						react: 'someOtherAtomicName',
						cora: 'someOtherAtomicName',
					},
				];

				convertToObject<DefaultTestObject>(testDataGroup, testObjectMatcher);

				expect(extractDataAtomicValue).toHaveBeenCalledTimes(2);

				expect(extractDataAtomicValue).toHaveBeenNthCalledWith(
					1,
					testDataGroup,
					testObjectMatcher[0],
					{}
				);

				expect(extractDataAtomicValue).toHaveBeenNthCalledWith(
					2,
					testDataGroup,
					testObjectMatcher[1],
					{}
				);
			});
		});
	});
});

// const PersonMatcher = [
// 	{
// 		react: 'id',
// 		cora: 'recordinfo/id',
// 	},
// 	{
// 		react: 'authorisedName',
// 		cora: 'authorisedName(NameMatcher)',
// 	},
// 	{
// 		react: 'alternativeNames[]',
// 		cora: 'alternativeName[](NameMatcher)',
// 	},
// 	{
// 		react: 'authorisedName',
// 		cora: 'name#type:authorised(NameMatcher)',
// 	},
// 	{
// 		react: 'alternativeNames[]',
// 		cora: 'name#type:alternative[](NameMatcher)',
// 	},
// 	{
// 		react: 'orcidIDs[]',
// 		cora: 'ORCID_ID[]',
// 	},
// ];

// const NameMatcher = [
// 	{
// 		react: 'familyName',
// 		cora: 'familyName',
// 	},
// 	{
// 		react: 'givenName',
// 		cora: 'givenName',
// 	},
// 	{
// 		react: 'language',
// 		cora: '#lang',
// 	},
// ];
